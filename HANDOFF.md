# Local Codex handoff — 6 November 2026

## The project

**Conspiracy Book Club and Social Aid and Pleasure Club.** A sourced regional field guide with maps, readings, historical context, uncertainty notes, and optional bars. The user wants unusual, well-supported stops rather than another list of the best-known Hollywood stories.

Requested workflow: **update the spreadsheet and geography → publish an open map/uMap edition → make a static vintage map → develop an interactive GitHub project.** The spreadsheet stage is complete for the current snapshot. This handoff makes the interactive code portable before the remaining stages.

## Current state

| Item | State |
|---|---|
| Shared Google Sheet | 72 georeferenced places; 44 history/research sites and 28 bars |
| Research queue | 14 unmapped leads, including 10 San Diego candidates |
| Local map in `docs/` | Uses all 72 places; no external build tools required |
| Previous hosted map | 61 places; not updated by this handoff |
| Reading list | 23 titles; source consultation limits recorded |
| Checked visits | H07 Ambassador site and B02 HMS Bounty only |
| uMap publication | Next step; no uMap account or saved map configured here |
| GitHub repository / Pages | Not created or configured |
| Google Sheet sync | Manual snapshot; no automatic sync |
| Static poster | Existing selected-stop illustration included as a style reference |

### Shared editing record

[conspiracy-haunts Google Sheet](https://docs.google.com/spreadsheets/d/1yyMXWSyson3z7Jo3hQ-q9XUDY7mmMCDXvb6QiAZbbm4/edit)

- `Sheet1` (gid 0): original 13 bar suggestions, preserved; geography comes from expandable ID lookups into Sites. Do not replace its original editorial columns with the master data.
- `Sites` (gid 21195041): 72 places, 28 columns A:AB, stable IDs and visit checkboxes.
- `ResearchQueue` (gid 1672109150): 14 leads; blank coordinates and false publication flags are intentional.
- `Workflow` (gid 1701189822): 12 stages.

The shared sheet was already link-accessible. This handoff made no sharing change. Local Codex must not assume the ChatGPT Google Drive connection is available on the user's machine. Included CSVs allow local work immediately. For a refresh, export the **Sites tab only** as CSV, compare IDs and edits, and replace `data/sites.csv` after reconciliation. Export ResearchQueue separately if needed. Do not treat Sheet1 as the Sites export.

### Existing site reference

[Previous hosted field map](https://conspiracy-book-club-los-angeles.bracedhawk1.chatgpt.site) is owner-private and may require login. Its source baseline is commit `f3a969d7f74cac1fb8291ebf049a4f20146dca6b`, hosted edition 2. The original had 61 records. Its HTML, CSS, JavaScript, and vendor files were copied into this package. The local copy now loads the 72-place snapshot. The hosted deployment was not changed.

No cloud-hosting repository binding or authentication credentials are included. The existing source commit is provenance; this ZIP is not a clone of its Git history.

## File guide

- `data/sites.csv`: current publication snapshot from Sites; editable locally with reconciliation.
- `data/research_leads.csv`: current queue; no invented coordinates.
- `data/sites.geojson`: generated 72-place export for open-map import.
- `docs/assets/places.geojson`: generated copy consumed by the interactive map.
- `data/baseline-61.geojson`: previous hosted data, retained for comparison only.
- `data/snapshot-manifest.json`: original spreadsheet export manifest.
- `research/WORKFLOW.md`: full staging, mapping, and archival research method.
- `research/READING_LIST.md`: 23-title list with links and consultation limits.
- `research/DOSSIER.md`: longer 61-place research edition; historical context, not the latest 72-row master.
- `research/LEAD_TEMPLATE.md`: form for deeper-cut investigations.
- `references/regional-poster.png`: generated vintage-style selected-stop illustration. Approximate geography; not a cartographic base or a complete 72-pin map.
- `tools/export_geojson.py`: standard-library converter and data checks, preserved from the workflow package.
- `tools/build.py`: rebuilds both current GeoJSON exports.
- `tools/check.py`: verifies exports, expected app properties, and bundled asset references.
- `tests/test_export.py`: regression checks for coordinates, duplicate IDs, publication status, and visits.

## Important research and geography details

The 11 additions to the previous 61-place edition are bars B18–B28. The original bar sheet had 13 suggestions; Frolic Room and HMS Bounty were already mapped, so they were matched to B04 and B02 rather than duplicated.

Watch these disambiguations:

- Chowder Barge's waterside location is approximately 33.777164, -118.242718. An address geocoder returned a point about a kilometre south. The published venue coordinate and the western longitude sign are documented in its basis note.
- The Woods in Hollywood is distinct from the West Hollywood cannabis business.
- Bigfoot West in Culver City is distinct from Bigfoot Lodge in Atwater Village. An operator office at 1936 Mateo is not either venue.
- Tonga Hut is the North Hollywood venue, not its Palm Springs namesake.
- Lucky Tiki is the West Hollywood venue, not Highland Park.

Source URLs and reading URLs are newline-separated lists inside quoted CSV cells. Preserve parallel list order. GeoJSON uses **[longitude, latitude]**. All coordinates are approximate and have a stated basis. The exporter checks Southern California bounds, finite coordinates, unique IDs, HTTPS links, title/URL alignment, visit booleans, and valid related-place IDs. It does not establish historical truth, current hours, or site access.

West pins H29/H30 distinguish institutional association and UCLA archival research. They do not establish an exact experiment location. Castaneda pins H33/H34 distinguish a former residence and UCLA materials. The full regional scope is not yet San Diego: the ten San Diego entries remain leads.

## Deeper cuts: next research batch

San Diego queue: Heaven's Gate former property; Unarius; Lomaland; Mount Ecclesia/Rosicrucian Fellowship; Lemurian Fellowship; Harmony Grove; Questhaven; SRF Encinitas; Yellow Deli/Twelve Tribes in Vista; Morning Star Ranch in Valley Center.

Other queued leads: Blackburn/Great Eleven historic parcels; Lewis Fielding's office burglary site; Process Church Los Angeles addresses; Burnell Foundation records. The Blackburn conviction was overturned: do not omit that fact. FBI files may contain allegations, not findings. Burnell is an archival lead, not a claim of misconduct.

For each lead, resolve two questions separately: **what happened, and where exactly was it?** Start with the cited queue sources. Trace addresses through contemporary directories, newspaper ads, parcel records, historic maps, and aerials. Use a primary record plus independent corroboration where available. Record unresolved conflicts instead of filling gaps with inference. A bar pairing is optional and comes after the site is supported.

Useful entry points:

- [UCSB American Religions Collection](https://www.library.ucsb.edu/special-collections/research/arcmss)
- [LAPL city directories index](https://www.lapl.org/city-directories-index)
- [UCLA Los Angeles Times photographic collection](https://www.library.ucla.edu/collections/explore/los-angeles-times-photographic-collection/)

## Next delivery sequence

1. Verify the local build and show the existing interactive map. Establish local Git history if none exists. Commit the baseline with no remote configured.
2. Prepare the uMap edition from `data/sites.geojson`, following WORKFLOW.md. A file export is already available; importing it does not establish a saved, shared uMap. Check popup formatting, colors, all IDs, the two visits, and the legend before calling it done. Account access may need a local browser session.
3. Make an accurate static map from the same coordinates. Use the included poster for visual style. Build the geographic base with mapping tools; reserve generated illustration for decoration and texture, not coordinate placement.
4. When the user is ready to publish on GitHub, choose the target account/repository and audience. `docs/` is already arranged for a GitHub Pages branch deployment. Confirm relative paths at the repository subpath. Add reproducible export/validation automation only when the source-of-truth and refresh policy are settled.
5. Research deeper cuts in batches. Do not stall mapping while attempting to resolve all 14 leads. Keep unresolved leads out of the published layer.

## Validation and limits of this handoff

See `VALIDATION.md` for checks run while packaging. This turn packages and checks the current snapshot; it does not independently repeat all historical research or verify current bar hours. The earlier UI was visually tested; the local 72-place data edition receives data, asset, syntax, and HTTP checks during handoff. Local visual checking remains the first task for Codex.
