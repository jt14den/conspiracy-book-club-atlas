# Project instructions

## Purpose and user

Build the Conspiracy Book Club and Social Aid and Pleasure Club's Southern California field guide: documented secrecy, intelligence history, religious and occult movements, disputed stories, archives, and optional nearby bars. The map covers Greater Los Angeles, both valleys, Orange County, and Ventura County. San Diego expansion is in the research queue.

Use plain English. Lead with the answer. Keep routine explanations short. Preserve Tim's voice and the club's personality in drafts. Challenge weak claims. Do not invent numerical confidence scores.

## Read first

Read `HANDOFF.md`, `research/WORKFLOW.md`, and `NEXT_PROMPT.md` before proposing major changes. A working map already exists in `docs/`. Continue from it.

## Data and evidence

- The Google Sheet linked in `HANDOFF.md` is the shared editing record. `data/sites.csv` is a versioned snapshot, not a live connection. Reconcile local edits before replacing either copy. Never overwrite newer sheet work without comparing it.
- Preserve stable `place_id` values and cross-references. Keep source and reading titles aligned with their newline-separated URLs inside quoted CSV cells. Use Python's CSV parser.
- Edit the CSV, then run `python3 tools/build.py`. Both GeoJSON files are generated outputs. `data/baseline-61.geojson` is an archival comparison, not the editing master.
- Only H07 (Ambassador site) and B02 (HMS Bounty) are checked off in the supplied snapshot. Change visits when the user reports a visit; do not infer visits from interest.
- ResearchQueue records are leads, not publishable findings. Do not invent coordinates for them or publish them merely because a geocoder returned an address.
- Separate evidence for the historical claim from evidence for the location. Preserve `coordinate_basis`, `geo_precision`, `evidence`, `limits`, and access notes. Decimal places do not establish positional accuracy.
- Preserve `wiki_relation`: a Wikipedia or Wikidata link may identify a person, organization, or archive rather than the physical building. Never substitute that entity's coordinates for the site.
- A nearby bar is a geographic pairing, not evidence of historical involvement. A movement's inclusion does not establish misconduct or membership in a common network.
- Distinguish documents, allegations, memoirs, investigative arguments, and established findings. Use Strong, Moderate, or Limited evidence with a reason when useful. Multiple pages repeating one story are not independent corroboration.
- Be careful with former private residences: document the historical site, respect present access limits, and do not imply public access.

## Historical corrections to preserve

Robert F. Kennedy was assassinated at the Ambassador Hotel in 1968; the victim was not RFK Jr. Treat the RAND/Pentagon Papers/bar story according to its cited evidence. Jolly West institutional and archival pins are not verified experiment rooms. Carlos Castaneda's UCLA archive and former residence are different kinds of locations.

## Implementation

Keep the site buildless unless a concrete requirement justifies added tooling. Use relative asset paths so `docs/` can work under a GitHub Pages repository subpath. Preserve the retro cream, green, and rust design and the selected-stop poster reference. Data geography must remain accurate enough for its stated precision; poster styling must not invent pin locations.

Run `python3 tools/build.py`, `python3 tools/check.py`, and `python3 -m unittest discover -s tests` after data or exporter changes. Use `node --check docs/app.js` if Node is available after JavaScript changes. Visually check desktop and mobile after UI changes. Do not claim that syntax or data checks constitute visual QA.

Keep vendor notices and map attribution. Do not bulk-download or prefetch OpenStreetMap tiles. A large public deployment needs a tile-service choice suited to its traffic and terms.

This handoff is for local work. No GitHub remote or Pages deployment is configured. Establish the target owner, repository, and audience when publication becomes the active task. Do routine local work without repeated permission requests. Keep credentials, `.env`, account tokens, and hosting control files out of commits and deliverables.
