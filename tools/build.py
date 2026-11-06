"""Build both publication overlays from the versioned Sites CSV. Python 3 only."""
from pathlib import Path
from export_geojson import export

ROOT = Path(__file__).resolve().parents[1]


def main():
    data_path = ROOT / 'data/sites.geojson'
    result = export(ROOT / 'data/sites.csv', data_path)
    (ROOT / 'docs/assets/places.geojson').write_bytes(data_path.read_bytes())
    print(f'Built {len(result["features"])} places in data/sites.geojson and docs/assets/places.geojson')


if __name__ == '__main__':
    main()
