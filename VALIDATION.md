# Handoff verification — 6 November 2026

The following checks passed during packaging:

- The standard-library build produced 72 places in both current GeoJSON files.
- Both generated outputs matched a fresh export of `data/sites.csv`.
- The two checked visits remained H07 and B02.
- Required app properties and bundled HTML/CSS asset references were present.
- Five exporter regression checks passed: visit/axis preservation, swapped-axis rejection, duplicate-ID rejection, held-place exclusion, and source-title/URL alignment.
- `node --check docs/app.js` passed.
- A temporary HTTP server returned 200 for the HTML, JavaScript, CSS, Leaflet, markercluster, the 72-feature GeoJSON, and a Leaflet image asset.
- The archive was extracted into a new temporary folder and checked again to verify relative paths and portability.

No new browser visual QA was performed for the 72-place local edition. Local Codex's first task includes desktop and mobile checking. Basemap tile delivery and outgoing research links depend on internet access and were not exhaustively checked here.

These are software and packaging checks. They do not repeat the historical investigation, establish exact property boundaries, confirm present opening hours, or resolve the 14 unpublished leads.
