# Work on this project with local Codex

This is a portable project, prepared on 6 November 2026. It contains the working interactive map, a 72-place data snapshot, 14 research leads, the 23-title reading list, the longer dossier, and the vintage poster reference.

## Open the project

Extract the ZIP. Move the `conspiracy-book-club-atlas` folder to your usual projects directory. Open **that folder** in your local Codex app or IDE extension.

If you use Terminal on macOS or Linux, assuming you moved the folder to `~/Projects`:

```sh
cd ~/Projects/conspiracy-book-club-atlas
codex
```

Paste this into Codex:

> Read AGENTS.md, START_HERE.md, and HANDOFF.md. Follow NEXT_PROMPT.md. Start by checking the project and opening a local preview.

If Codex is not installed, follow the [official Codex CLI setup instructions](https://developers.openai.com/codex/cli/). Run `codex` from this folder and choose **Sign in with ChatGPT** when prompted. Your local Codex session will read these files; this chat and its connected accounts do not transfer automatically.

## Preview without Codex

Pixi is the preferred environment manager. It installs Python and Node for the project. The app uses plain HTML, CSS, and JavaScript. No npm installation, API key, or database is needed for the map.

```sh
pixi install
pixi run build
pixi run validate
pixi run serve
```

Open <http://127.0.0.1:8000>. Press Control-C in Terminal to stop the server. Use a different port if 8000 is occupied. Do not open `index.html` with a `file://` URL: the map loads its data using `fetch`.

The bundled app code and research files are local. The street basemap needs internet access and loads OpenStreetMap tiles. Reading links also need internet access. Local serving is not public hosting.

## What is ready

- `docs/`: working interactive map with 72 places, filters, sources, and reading links.
- `data/sites.geojson`: the same 72-place overlay, ready for the next uMap import step.
- `HANDOFF.md`: completed work, open questions, and the order of next steps.
- `NEXT_PROMPT.md`: the full first task for local Codex.

The existing hosted map still has 61 places. This package does not publish the new edition, create a GitHub repository, or configure automatic spreadsheet sync.
