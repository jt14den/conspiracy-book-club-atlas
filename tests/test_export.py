"""Protect meaningful export invariants using temporary copies of the data."""
import csv
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from export_geojson import export


class ExportTests(unittest.TestCase):
    def setUp(self):
        with (ROOT / 'data/sites.csv').open(encoding='utf-8-sig', newline='') as h:
            reader = csv.DictReader(h)
            self.fields = reader.fieldnames
            self.rows = list(reader)
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)

    def run_export(self, rows=None):
        source = Path(self.temp.name) / 'sites.csv'
        with source.open('w', encoding='utf-8', newline='') as h:
            writer = csv.DictWriter(h, fieldnames=self.fields)
            writer.writeheader()
            writer.writerows(self.rows if rows is None else rows)
        return export(source, Path(self.temp.name) / 'sites.geojson')

    def test_visit_flags_and_axis_order_survive(self):
        result = self.run_export()
        by_id = {f['id']: f for f in result['features']}
        for row in self.rows:
            if row['publication_status'] not in {'existing_map', 'ready_next_export'}:
                continue
            feature = by_id[row['place_id']]
            self.assertEqual(feature['geometry']['coordinates'], [float(row['longitude']), float(row['latitude'])])
            self.assertIs(feature['properties']['checked'], row['checked'].lower() == 'true')

    def test_swapped_axes_are_rejected(self):
        row = self.rows[0]
        row['latitude'], row['longitude'] = row['longitude'], row['latitude']
        with self.assertRaisesRegex(ValueError, 'bounds'):
            self.run_export()

    def test_duplicate_id_is_rejected(self):
        self.rows.append(dict(self.rows[0]))
        with self.assertRaisesRegex(ValueError, 'duplicate'):
            self.run_export()

    def test_whitespace_in_id_is_normalized_consistently(self):
        ident = self.rows[0]['place_id']
        self.rows[0]['place_id'] = ' ' + ident + ' '
        result = self.run_export()
        feature = next(f for f in result['features'] if f['id'] == ident)
        self.assertEqual(feature['properties']['id'], ident)

    def test_held_unreferenced_place_is_excluded(self):
        baseline = self.run_export()
        referenced = {p for f in baseline['features'] for p in f['properties']['related_places']}
        row = next(r for r in self.rows if r['place_id'] not in referenced and r['publication_status'] in {'existing_map', 'ready_next_export'})
        row['publication_status'] = 'hold'
        result = self.run_export()
        self.assertEqual(len(result['features']), len(baseline['features']) - 1)
        self.assertNotIn(row['place_id'], {f['id'] for f in result['features']})

    def test_misaligned_source_titles_are_rejected(self):
        self.rows[0]['source_titles'] += '\nUnpaired title'
        with self.assertRaisesRegex(ValueError, 'counts differ'):
            self.run_export()


if __name__ == '__main__':
    unittest.main()
