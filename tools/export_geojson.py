"""Convert a Sites-tab CSV export into a validated GeoJSON publication snapshot.

Usage: python export_geojson.py sites.csv output.geojson
Standard library only. This does not geocode or independently verify history.
"""
import csv
import json
import math
import sys
from pathlib import Path

PUBLISHED = {'existing_map', 'ready_next_export'}
STATUSES = PUBLISHED | {'hold', 'retired'}

def boolean(value):
    value = str(value).strip().lower()
    if value in {'true', '1', 'yes'}:
        return True
    if value in {'false', '0', 'no'}:
        return False
    raise ValueError('checked must be TRUE or FALSE')

def links(titles, urls):
    ts = titles.splitlines()
    us = urls.splitlines()
    if len(ts) != len(us):
        raise ValueError('Source/reading title and URL counts differ')
    if any(not u.startswith('https://') for u in us):
        raise ValueError('Source and reading links must use HTTPS')
    return [{'title': t, 'url': u} for t, u in zip(ts, us)]

def export(source, destination):
    with Path(source).open(encoding='utf-8-sig', newline='') as handle:
        reader = csv.DictReader(handle)
        required = {'place_id', 'name', 'latitude', 'longitude', 'coordinate_basis',
                    'publication_status', 'checked', 'source_titles', 'source_urls'}
        if not required <= set(reader.fieldnames or []):
            raise ValueError('Missing columns: ' + ', '.join(sorted(required - set(reader.fieldnames or []))))
        rows = list(reader)
    seen = set()
    features = []
    for row in rows:
        ident = row['place_id'].strip()
        if not ident or ident in seen:
            raise ValueError('Missing or duplicate place ID: ' + ident)
        seen.add(ident)
        if not row['name'].strip():
            raise ValueError(ident + ': missing name')
        status = row['publication_status'].strip()
        if status not in STATUSES:
            raise ValueError(ident + ': unknown publication_status')
        if status not in PUBLISHED:
            continue
        try:
            lat, lon = float(row['latitude']), float(row['longitude'])
        except (ValueError, TypeError):
            raise ValueError(ident + ': coordinates are missing or non-numeric') from None
        if not all(map(math.isfinite, (lat, lon))) or not (32.4 < lat < 35.2 and -120.0 < lon < -116.0):
            raise ValueError(ident + ': outside Southern California bounds; check sign and axis order')
        if not row['coordinate_basis'].strip():
            raise ValueError(ident + ': coordinate basis is missing')
        sources = links(row['source_titles'], row['source_urls'])
        if not sources:
            raise ValueError(ident + ': source is missing')
        readings = links(row.get('reading_titles', ''), row.get('reading_urls', ''))
        props = dict(row)
        props.pop('place_id')
        props['id'] = ident
        props.pop('latitude'); props.pop('longitude')
        for key in ['source_titles', 'source_urls', 'reading_titles', 'reading_urls']:
            props.pop(key, None)
        props['sources'] = sources
        props['reading_list'] = readings
        props['checked'] = boolean(row['checked'])
        props['checked_status'] = 'Checked off by club' if props['checked'] else 'Not marked visited'
        props['story'] = props.pop('history', '')
        props['related_places'] = [x.strip() for x in row.get('related_places', '').split(',') if x.strip()]
        props['maps_url'] = f'https://www.google.com/maps/search/?api=1&query={lat},{lon}'
        color = '#27824c' if props['checked'] else '#7446a2' if ident in {'H29','H30'} else '#2567a5' if row.get('category') == 'Bar' else '#bc6128'
        props['marker-color'] = color
        props['marker-symbol'] = 'star' if props['checked'] else 'bar' if row.get('category') == 'Bar' else 'circle'
        props['_umap_options'] = {'color': color, 'showLabel': False}
        text = [props['story']]
        for label, key in [('Evidence', 'evidence'), ('Limits', 'limits'), ('Access', 'access')]:
            text.append(label + ': ' + props.get(key, ''))
        text.append('Sources:\n' + '\n'.join(x['title']+' — '+x['url'] for x in sources))
        text.append('Reading:\n' + '\n'.join(x['title']+' — '+x['url'] for x in readings))
        props['description'] = '\n\n'.join(text)
        features.append({'type': 'Feature', 'id': ident,
                         'geometry': {'type': 'Point', 'coordinates': [lon, lat]},
                         'properties': props})
    for feature in features:
        missing = set(feature['properties']['related_places']) - {f['id'] for f in features}
        if missing:
            raise ValueError(feature['id'] + ': related place excluded or absent: ' + ', '.join(sorted(missing)))
    output = {'type': 'FeatureCollection', 'name': 'Conspiracy Book Club — publication snapshot', 'features': features}
    target = Path(destination)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
    return output

if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    result = export(sys.argv[1], sys.argv[2])
    print(f'Exported {len(result["features"])} places')
