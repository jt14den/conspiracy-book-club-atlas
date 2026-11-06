# Conspiracy Book Club and Social Aid and Pleasure Club
## Spreadsheet → uMap → static map → interactive GitHub atlas

Prepared November 6, 2026.

Local handoff note: the proposed repository layout below has now been implemented in this package. The working app uses `docs/assets/places.geojson`; rebuild it and `data/sites.geojson` with `python3 tools/build.py` from the project root. uMap and GitHub publication are still pending.

**Recommendation: edit the places once, then generate each map from the same reviewed GeoJSON.** The spreadsheet is the editing surface. GitHub keeps versioned publication snapshots, the website and the map-building code. uMap is the quick geographic review and sharing surface. The static map is a dated output of the same data.

## What is ready now

[Open the existing conspiracy-haunts spreadsheet](https://docs.google.com/spreadsheets/d/1yyMXWSyson3z7Jo3hQ-q9XUDY7mmMCDXvb6QiAZbbm4/edit)

- **Sheet1:** the original 13 bar suggestions are preserved. Added place IDs, addresses, coordinates, coordinate methods, location sources and notes. Location fields pull from Sites using IDs, so a geography correction has one editable home. Original names, neighborhoods, vibes and pairing cells were preserved.
- **Sites:** 72 georeferenced places: the previous 61 plus 11 additional bars from the original sheet. Frolic Room and HMS Bounty already existed and were matched to their existing IDs. This is 44 history/research places and 28 bars. Only the Ambassador site and HMS Bounty remain checked.
- **ResearchQueue:** 14 unmapped leads: ten San Diego County candidates and four archival investigations. Missing coordinates remain blank. Their publication checkboxes are off.
- **Workflow:** the publishing sequence, responsibilities and limits described below.
- **Portable snapshot:** sites.csv, sites.geojson, research_leads.csv and a small CSV-to-GeoJSON exporter are packaged with this document.

This setup updated the spreadsheet and prepared exports. It did not create a uMap map, regenerate the poster, create a GitHub repository or update the hosted 61-place map. Those are the next implementation stages.

### Geography corrections worth retaining

Chowder Barge is in Wilmington, although the original list says Long Beach. Its website publishes an on-water coordinate with an unsigned western longitude; the longitude was normalized to negative and the choice recorded. The street-address geocoder placed it farther south, so that result was not used for the barge point.

The original two Bigfoot rows refer to Bigfoot West and the Atwater Village Bigfoot Lodge. The Woods Hollywood is distinct from the similarly named West Hollywood cannabis venue. Lucky Tiki’s West Hollywood and Highland Park locations are separate. The original labels remain visible alongside the resolved locations.

## 1. Maintain the spreadsheet

**Sites is the master place table.** Edit coordinates and narratives there. Sheet1 is the original bar shortlist with geography lookups, not a second coordinate database. ResearchQueue is for material that is not ready for a map.

The stable place_id is the join key. Never use row number as identity or recycle an old ID for a different property. Row order can change without changing identity.

The key fields are name, region, category, address, latitude, longitude, coordinate_basis, geo_precision, publication_status, checked, history, evidence, limits, access, sources and readings. The existing distinction between a physical building and an associated person or organization is retained in the source GeoJSON; entity links must not be used to relocate a historical property.

Keep **support for the historical association** separate from **support for the location**. A documented organization can still have an unresolved street address. A correct modern geocode does not prove that the historical event happened there.

Current publication_status values:

| Value | Meaning |
|---|---|
| existing_map | Present in the existing 61-place edition |
| ready_next_export | A sourced, georeferenced addition prepared for the next map edition |
| hold | Keep in the working dataset; exclude from map export |
| retired | Retain the record for provenance; exclude from map export |

“Existing map” describes the previous edition, not a permanent exemption from factual review. All points retain approximate-location notes. Visit checkmarks describe the club’s visit history, not evidentiary certainty.

## 2. Export and review the geography

For the first version, use a **manual CSV export from the Sites tab**. This keeps the process simple and avoids publishing the working Google Sheet to the web just to feed a map.

Run the supplied exporter against that CSV. It checks required fields, duplicate IDs, coordinate ranges, source links, publication states and Boolean visit marks. CSV uses separate latitude/longitude columns; GeoJSON uses **[longitude, latitude]**. Numerical coordinates do not imply surveyed precision.

The exporter rebuilds the display description from the current structured fields. It does not geocode, establish historical facts, check current opening hours or resolve conflicting source accounts.

Review new or moved pins on a street map before release. Pay particular attention to repeated street names, venue branches, broad landscapes, demolished buildings and archive-access points. Keep a short change log: date, changed IDs, source for the change, and whether it affects a location or a historical claim.

## 3. Build the uMap version

Use **uMap**, an OpenStreetMap-based overlay tool. Import the reviewed GeoJSON, then configure the popup to show history, evidence, limits, access, sources and readings. Use consistent colors for history, bars, West/archive research and checked stops.

Initially, a manual import is sufficient. Once GitHub Pages hosts the data, configure the uMap layer to read the same published GeoJSON URL. Edit the spreadsheet rather than individual remote-layer points in uMap. Test cross-origin loading and refresh behavior on the selected uMap instance before relying on automatic updates.

uMap is an overlay: this does not add speculative historical claims to the underlying OpenStreetMap database.

References: [uMap import formats](https://wiki.openstreetmap.org/wiki/UMap/Guide/Import_data_files) · [remote-data and spreadsheet guides](https://discover.umap-project.org/support/advanced/)

## 4. Make the static historical-style map

Render the **same geographic data**, using QGIS or a reproducible cartographic script. Preserve point positions while applying the club’s cream, green and rust palette, historical typography, labels and illustrated border.

Use regional panels or insets when the geography becomes too broad for readable labels. A selected-stops poster should say so. Keep the full interactive atlas as the complete directory.

Include the edition date, data snapshot identifier, scale or explicit schematic label, legend and basemap attribution. If we make another freely illustrated poster, label it approximate rather than presenting it as a geographic reference. Recheck that only the two requested stops have visit marks.

## 5. Put the interactive atlas on GitHub Pages

**Yes: GitHub Pages can host this kind of interactive map.** It serves the files; Leaflet runs in the visitor’s browser. A database or application server is not required for a read-only map of this size. Our existing Leaflet map is a suitable starting point.

The first release should offer region/topic filters, text search, visit marks, sourced place details, reading lists, related-place links and downloadable data. A historical-date filter can follow after event dates and date uncertainty have been entered consistently; do not infer event years from research dates.

Suggested repository name: **conspiracy-book-club-atlas**. This is a proposal, not an existing repository.

| Repository path | Purpose |
|---|---|
| data/sites.csv | Versioned snapshot exported from the master Sites tab |
| tools/export_geojson.py | Validate and convert the snapshot |
| docs/assets/places.geojson | Generated map data, served by the existing app |
| docs/index.html and map assets | Interactive Leaflet atlas |
| docs/readings/ | Reading list and interpretive essays |
| maps/ | Dated static maps and their project/build files |
| research/ | Research method and a reusable lead template |
| CHANGELOG.md | What changed between published editions |

A sensible release path is: export CSV → commit a branch → validate and review the map diff → merge the change → publish Pages → refresh the uMap data → rebuild the static map for that edition. GitHub Actions can later automate validation and deployment. The first version does not need automated access to Google Sheets.

Maintain the editing/publication distinction: the Sheet is the live working record; the committed CSV is the authoritative snapshot for a particular release. Never hand-edit the generated GeoJSON and expect that change to survive the next export.

References: [GitHub Pages publishing workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) · [Leaflet’s GeoJSON guide](https://leafletjs.com/examples/geojson/)

## 6. Research deeper cuts

**A deeper cut should mean a less familiar, well-supported story—not a more elaborate unsupported claim.** Search for organizations, people and historical addresses rather than only searching for “cult sites near Los Angeles.” A bar can be paired after the historical location is established.

### Discovery: start below the travel-list layer

1. Follow bibliographies and footnotes in the reading list. Record aliases, predecessor groups, meeting halls, printers, schools and retreats.
2. Search archival finding aids and folder inventories. Finding aids identify promising material; they do not substitute for reading the documents.
3. Search period newspaper advertisements as well as reporting. Ads can reveal teaching rooms and branch addresses that later histories omit.
4. Use city directories, historical maps, building records and aerial photographs to connect old street numbers to a current parcel. Record renumbering, demolition and relocation.
5. Follow one documented link at a time: a person to an organization, an organization to a dated address, that address to a parcel. A shared address or person does not by itself prove coordination.

### A useful first research circuit

| Resource | What it can contribute |
|---|---|
| [UCSB American Religions Collection](https://www.library.ucsb.edu/special-collections/research/arcmss) | Organizational ephemera, newsletters, research files and correspondence. Russell Chandler’s papers offer a religion reporter’s research files; ARC Mss 10 documents Los Angeles New Thought practitioners associated with the Burnell Foundation. |
| [LAPL city directories](https://www.lapl.org/city-directories-index) and [digitized directories](https://rescarta.lapl.org/ResCarta-Web/jsp/RcWebBrowseCollections.jsp) | Historical people/business listings and address verification. |
| [UCLA Los Angeles Times Photographic Collection](https://www.library.ucla.edu/collections/explore/los-angeles-times-photographic-collection/) | Images and captions that may help connect events, people and buildings; includes Orange County and San Diego bureau material. |
| City/county historic-property records, local historical societies and archival newspapers | Parcel history, building survival, address changes and independent local context. Match the source to the jurisdiction and period. |

These are search routes, not claims that every relevant record is online or already examined.

### Test each lead

For each candidate, record:

- The precise claim and the time period it concerns.
- The historical address, its source, and whether it resolves to a current property.
- The original document or participant account; an independent corroborating source where available.
- Counterevidence and conflicting dates, addresses or identities.
- Separate assessments of historical support and geographic support: strong, moderate or limited, with a reason.
- What can be visited now, and when that access was checked.
- The next research action. A failed search or rejected match is worth retaining.

Two websites repeating the same newspaper item are one source chain. An official organization’s page establishes its address and stated beliefs, not the truth of supernatural claims. An FBI or CIA file may preserve unverified allegations. A memoir offers a participant’s perspective. Label each accordingly.

### Four first assignments, already in ResearchQueue

| Lead | Next useful action | What would make it map-ready |
|---|---|---|
| Blackburn / Great Eleven | Trace period Los Angeles headquarters and the Simi retreat through directories and property history. | A dated address/property match; account for the overturned conviction when describing the case. |
| Lewis Fielding office burglary | Use case records and period directories to establish the September 1971 office address. | A defensible historical parcel match for the documented burglary. |
| Process Church Los Angeles locations | Extract dated addresses from the released files and corroborate them independently. | A property match and a concise historical claim that does not turn allegations into findings. |
| Burnell Foundation / Los Angeles New Thought | Inspect ARC Mss 10 and trace the names and dated addresses found there. | A specific local institutional story and location. The archival description establishes a research lead, not misconduct. |

## A practical stopping rule

Work a bounded batch of leads, keep a search log, and publish the ones that earn a location and a supportable short account. It is useful for a research pass to end with unresolved or rejected leads. Do not fill the map with guessed pins just to achieve a target number.

The deliverable for a deeper-cut pass should be a small dossier for each promising place: claim, sources, exact uncertainty, location evidence, access and one reading pairing. The map is the summary of that work.
