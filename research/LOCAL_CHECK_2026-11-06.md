# Local verification, 6 November 2026

## Repository setup follow-up

Initialized a separate local Git repository on `main` in this project folder. The parent repository was not staged or committed. `pixi.lock` is now present, and `pixi run --locked validate` passed all data, Python, and JavaScript checks.

Target: a private personal GitHub repository named `conspiracy-book-club-atlas`. Remote creation remains pending: the session policy blocks the GitHub CLI configuration path, and the connected GitHub tools do not support repository creation. No remote or Pages deployment is configured.

After the local baseline commit, create and push from a normal terminal in this folder:

```sh
gh repo create conspiracy-book-club-atlas --private --source=. --remote=origin --push
```

## Pixi setup

Added `pixi.toml` with Python 3.13, Node 22, and build/check/test/validate/serve/preview tasks. Updated README.md and START_HERE.md. Ignored `.pixi/`.

`pixi install` could not write the package cache in the sandbox. The approved retry crashed in system-configuration 0.6.1 with "Attempted to create a NULL object." No successful environment installation or lockfile generation was verified. Run `pixi install` from a normal terminal, then `pixi run build` and `pixi run validate`. Preserve the resulting lockfile. Pixi does not resolve the session's socket restriction.

## Debugging follow-up

Fixed three defects:

- Place details now merge sources and readings, removing duplicate URLs. An empty reading list no longer hides sources.
- Invalid percent encoding in a URL fragment no longer sends successful data loading into the error handler.
- The exporter now uses the normalized stable ID in both the feature and its properties.

Rebuilt exports. Data checks, all six Python regression tests, JavaScript syntax, and `node tests/test_app.cjs` passed. Current snapshot counts and checked visits are unchanged.

The approved server retry still failed at socket binding with PermissionError. Browser inventory still reports the browser access host unavailable. Desktop and mobile visual QA remain blocked. No project registry log or registry handoff was saved because this folder has no registered key. This file holds the local continuation notes.

Read AGENTS.md, START_HERE.md, HANDOFF.md, NEXT_PROMPT.md, and WORKFLOW.md.

Passed:

- `python3 tools/build.py`: rebuilt both GeoJSON files with 72 places.
- `python3 tools/check.py`: exports match the CSV; assets and properties present.
- `python3 -m unittest discover -s tests`: all five tests passed.
- `node --check docs/app.js`: syntax passed.
- Data inspection: only H07 and B02 are checked. The 14 research leads remain outside the map.

Blocked:

- The local HTTP server could not bind to 127.0.0.1:8000. Both the sandbox attempt and approved escalated attempt returned PermissionError.
- The browser tool returned "The browser access host is unavailable."
- No desktop or mobile visual QA was completed. All, Bars, Jolly West, Castaneda, Checked, new-bar details, and source-link interactions still need browser verification.
- The folder is not registered in projctx. No valid project key exists for a lease, project log, or registry handoff.
- Git resolves to the parent `~/projects` repository. No Git initialization or commit was attempted, to avoid changing the parent repository.

## Next session

Start the preview in a terminal that permits local sockets:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Open http://127.0.0.1:8000 and complete the browser checks above. Expected filter counts: All 72, Bars 28, Jolly West 2, Castaneda 2, Checked 2.

## uMap preparation

The existing `data/sites.geojson` includes all 72 stable IDs, coordinates, source and reading lists, popup descriptions, and per-feature `_umap_options` colors. No new export format is needed before import.

Import into a new layer on the chosen uMap instance. Do not replace an existing map's layers without comparing them. The official guide confirms that GeoJSON imports retain properties: https://wiki.openstreetmap.org/wiki/UMap/Guide/Import_data_files

Before saving or sharing, inspect H07 and B02 visit marks, H29/H30 institutional and archive distinctions, H33/H34 residence and archive distinctions, and B18-B28 additions. Check popup links, evidence, limits, access, coordinate precision, colors, and the legend. Confirm 72 distinct IDs after import. A saved map and sharing URL remain pending; browser access and a chosen uMap instance/account are needed.

The accurate static map and GitHub publication remain pending. No external service, spreadsheet, visit status, or historical claim was changed.
