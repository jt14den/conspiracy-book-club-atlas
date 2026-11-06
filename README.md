# Conspiracy Book Club — Southern California Atlas

A field map for the **Conspiracy Book Club and Social Aid and Pleasure Club**. Explore sourced historical sites, religious and occult movements, disputed stories, archives, and nearby bars. Each place carries evidence, limits, sources, readings, and an approximate location basis.

Prepared local handoff: 6 November 2026. **72 places, 14 unpublished research leads, 23 reading-list titles.** The current mapped extent covers Los Angeles, the valleys, Orange County, and Ventura County. San Diego is a research queue, not a published layer.

Read [START_HERE.md](START_HERE.md) for Codex setup and [HANDOFF.md](HANDOFF.md) for project state.

## Build and preview

Use Pixi to manage Python and Node. The site remains plain HTML, CSS, and JavaScript, with no pip or npm dependencies:

```sh
pixi install
pixi run build
pixi run validate
pixi run serve
```

Open <http://127.0.0.1:8000>. Stop with Control-C. `pixi run preview` rebuilds and starts the server. `pixi run validate` checks the existing exports, Python tests, JavaScript tests, and JavaScript syntax without rebuilding stale files. Street tiles load from OpenStreetMap over the internet; no offline basemap is included.

The first successful `pixi install` creates `pixi.lock`. Keep `pixi.toml` and that lockfile in version control; `.pixi/` is a local environment. The manifest targets Apple Silicon and Intel macOS, Linux x86-64, and Windows x86-64. Once the lockfile exists, use `pixi install --locked` to reproduce it. The underlying Python scripts remain usable without Pixi. Pixi does not change the agent's socket permissions; run the preview in a normal terminal if local binding is blocked.

## Edit and export

The shared [Google Sheet](https://docs.google.com/spreadsheets/d/1yyMXWSyson3z7Jo3hQ-q9XUDY7mmMCDXvb6QiAZbbm4/edit) is the team editing record. `data/sites.csv` is a checked-in publication snapshot. Local edits and later sheet exports must be reconciled. There is no live sync.

Run `python3 tools/build.py` after changing `data/sites.csv`. It generates both `data/sites.geojson` for uMap import and `docs/assets/places.geojson` for the local site. Do not edit either GeoJSON as a competing master. `data/baseline-61.geojson` preserves the prior hosted edition for comparison.

`existing_map` and `ready_next_export` rows publish. `hold` and `retired` rows do not. Coordinates use GeoJSON longitude/latitude order and are approximate. The exporter validates structure and basic geography, not historical truth.

## Research and design

See `research/WORKFLOW.md`, `research/READING_LIST.md`, and `research/LEAD_TEMPLATE.md`. The longer dossier covers the previous 61-place edition. The poster in `references/` is a generated selected-stop style reference, not an accurate geographic base.

The app in `docs/` is static and uses relative paths suitable for a future GitHub Pages repository subpath. No deployment, GitHub remote, uMap account, or background automation is configured by this package.

## Attribution and rights

Basemap: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). The live site must retain attribution and respect the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

Bundled dependencies: Leaflet 1.9.4 (BSD 2-Clause) and Leaflet.markercluster 1.5.3 (MIT). Their notices are in `docs/assets/licenses/`; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). No license for the project's original content or code has been selected in this handoff. External sources retain their own rights. The reading list records what was actually consulted; inclusion does not imply the full book was read.
