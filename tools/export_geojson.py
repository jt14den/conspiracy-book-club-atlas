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

TOPIC_LABELS = {
    'documented_conspiracies': 'Documented Conspiracies',
    'intelligence_research': 'Intelligence & Research',
    'conspiracy_beliefs': 'Conspiracy Beliefs',
    'political_violence': 'Political Violence',
    'political_organizing': 'Political Organizing',
    'crime_legal': 'Crime & Legal History',
    'religious_esoteric': 'Religious & Esoteric',
    'occult_spiritual': 'Occult & Ritual',
    'communal_counterculture': 'Communes & Counterculture',
    'arts_music': 'Arts, Music & Literature',
    'folklore_legends': 'Folklore & Disputed Lore',
}

ROLE_LABELS = {
    'organizational_office': 'Institution / Headquarters',
    'event_site': 'Event / Venue Site',
    'residence': 'Residence / Compound',
    'ownership_connection': 'Ownership Connection',
    'performance_venue': 'Performance Venue',
    'archive': 'Archive / Museum Collection',
    'memorial_site': 'Memorial Site',
    'landscape': 'Ranch / Landscape Site',
    'bar': 'Watering Hole',
}


def determine_pin_kind(ident, category, role, topics):
    if category == 'Bar' or role == 'bar':
        return 'bar'
    if role == 'archive' or ident in {'H30', 'H34', 'H41'}:
        return 'archive'
    if 'intelligence_research' in topics or 'documented_conspiracies' in topics:
        return 'intel'
    if 'occult_spiritual' in topics or 'religious_esoteric' in topics:
        if 'communal_counterculture' in topics and ident in {'H02', 'H05', 'H08', 'H09', 'H17', 'H18', 'H38', 'H39'}:
            return 'commune'
        return 'esoteric'
    if 'communal_counterculture' in topics:
        return 'commune'
    return 'lore'


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
        raw_topics = [t.strip() for t in (row.get('topics') or '').split(';') if t.strip()]
        for t in raw_topics:
            if t not in TOPIC_LABELS:
                raise ValueError(f'{ident}: unknown topic slug: {t}')
        role = (row.get('location_role') or '').strip()
        if role and role not in ROLE_LABELS:
            raise ValueError(f'{ident}: unknown location_role: {role}')
        props = dict(row)
        props.pop('place_id')
        props['id'] = ident
        props.pop('latitude'); props.pop('longitude')
        for key in ['source_titles', 'source_urls', 'reading_titles', 'reading_urls']:
            props.pop(key, None)
        props['topics'] = raw_topics
        props['topic_labels'] = [TOPIC_LABELS[t] for t in raw_topics]
        props['location_role'] = role
        props['location_role_label'] = ROLE_LABELS.get(role, '')
        props['pin_kind'] = determine_pin_kind(ident, row.get('category', ''), role, raw_topics)
        props['sources'] = sources
        props['reading_list'] = readings
        props['checked'] = boolean(row['checked'])
        props['checked_status'] = 'Checked off by club' if props['checked'] else 'Not marked visited'
        props['story'] = props.pop('history', '')
        props['related_places'] = [x.strip() for x in row.get('related_places', '').split(',') if x.strip()]
        props['maps_url'] = f'https://www.google.com/maps/search/?api=1&query={lat},{lon}'
        color = '#27824c' if props['checked'] else '#7446a2' if props['pin_kind'] == 'archive' else '#233b32' if props['pin_kind'] == 'intel' else '#2567a5' if props['pin_kind'] == 'bar' else '#a44b2d' if props['pin_kind'] in {'lore', 'commune'} else '#bc6128'
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
        raise ValueError(__doc__)
    result = export(sys.argv[1], sys.argv[2])
    print(f'Exported {len(result["features"])} places')
