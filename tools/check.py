"""Check that current outputs match the CSV and the local app has its assets."""
import json
import re
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from export_geojson import export

ROOT = Path(__file__).resolve().parents[1]


class AssetLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if value and ((tag == 'script' and key == 'src') or (tag == 'link' and key == 'href')):
                self.links.append(value)


def main():
    with tempfile.TemporaryDirectory() as td:
        expected = export(ROOT / 'data/sites.csv', Path(td) / 'check.geojson')
    for name in ('data/sites.geojson', 'docs/assets/places.geojson'):
        actual = json.loads((ROOT / name).read_text(encoding='utf-8'))
        if actual != expected:
            raise SystemExit(f'{name} is stale. Run python3 tools/build.py')
    records = expected['features']
    for f in records:
        p = f['properties']
        for key in ('name', 'region', 'category', 'address', 'coordinate_basis', 'evidence', 'limits', 'access'):
            if not p.get(key):
                raise SystemExit(f'{f["id"]}: app property missing: {key}')
    doc = ROOT / 'docs'
    parser = AssetLinks()
    parser.feed((doc / 'index.html').read_text(encoding='utf-8'))
    for link in parser.links:
        if not urlsplit(link).scheme and not (doc / link).is_file():
            raise SystemExit(f'Missing HTML asset: {link}')
    css = (doc / 'assets/leaflet.css').read_text(encoding='utf-8')
    for ref in re.findall(r'url\(([^)]+)\)', css):
        ref = ref.strip('\"\'')
        if not ref.startswith(('#', 'data:', 'http')) and not (doc / 'assets' / ref).is_file():
            raise SystemExit(f'Missing Leaflet asset: {ref}')
    for name in ('Leaflet-LICENSE.txt', 'Leaflet.markercluster-LICENSE.txt'):
        if not (doc / 'assets/licenses' / name).is_file():
            raise SystemExit(f'Missing vendor license: {name}')
    checked = [f['id'] for f in records if f['properties']['checked']]
    print(f'PASS: {len(records)} places; generated exports match CSV; assets and app properties present.')
    print('Checked visits: ' + ', '.join(checked))
    print('This checks structure and files, not historical truth, current access, or visual layout.')


if __name__ == '__main__':
    main()
