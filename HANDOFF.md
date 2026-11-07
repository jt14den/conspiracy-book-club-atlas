# Session Handoff — 2026-11-06

## Accomplished
- **GitHub Pages Live Deployment:** Configured `jt14den/conspiracy-book-club-atlas` (`main:/docs` with `docs/.nojekyll`), live at `https://www.tim-dennis.com/conspiracy-book-club-atlas/`.
- **Faceted Taxonomy & Custom Pin Icons:**
  - Applied `topics` (multi-value `;`-delimited) and `location_role` across all records in `data/sites.csv` and `tools/export_geojson.py`.
  - Replaced text pin labels (`H01`/`B01`) with 9 custom category SVG icons (`esoteric`, `intel`, `commune`, `lore`, `archive`, `tiki`, `dining`, `vegan`, `bar`) and removed `Checked / Visited` UI overrides from the map and sidebar while preserving `checked` boolean compatibility in GeoJSON exports (`H07`, `B02`).
- **Expanded Dataset to 139 Rows (138 Published Stops + 1 Hold):**
  - **Tiki Bars (`B29`–`B35`, `B46`–`B54`, `B69`–`B72`):** Curated Southern California & San Diego tiki landmarks (including KML extraction from `tikimap.com/themap/`).
  - **Old-School Steakhouses & Red-Booth Classics (`B36`–`B45`):** Musso & Frank, Tam O'Shanter, The Sycamore Inn, The Smoke House, Taylor's, The Bull Pen, Dal Rae, Pacific Dining Car, Dan Tana's, Cole's.
  - **Top-Tier Vegan Restaurants (`B55`–`B64`, `B70`):** Crossroads Kitchen, Planta Cocina, Gracias Madre, Shunji/Kusaki, Au Lac, Jitlada vegan-friendly/Vinh Loi Tofu, Stuff I Eat, H.O.P.E., Follow Your Heart Market & Cafe, Monty's Good Burger, plus San Diego's Mothership (`B70`, `tiki;vegan`).
  - **San Diego County Expansion (`H45`–`H60`, `B65`–`B72`):** Integrated `research/san_diego_sites_2026-11-06.csv` (`H45`–`H60`, `B65`–`B68`; `H59` held per parcel rules) plus San Diego tiki/vegan stops (`B69`–`B72`).
  - **Classic SoCal Compendium Stops (`H61`–`H67`):** TRW Space Park / "Falcon and the Snowman" (`H61`), Port of Long Beach Pier E / *Hughes Glomar Explorer* & Project Azorian (`H62`), Jet Propulsion Laboratory & Arroyo Seco Jack Parsons rocket tests (`H63`), Former Norton AFB / USAF AAVS film vault (`H64`), Naval Air Station Point Mugu (`H65`), The Getty Center tram/vaults vs. underground tunnel lore (`H66`), and Naval Air Station North Island / 2004 USS *Nimitz* "Tic Tac" UAP hub (`H67`).
- **UI & Cartography Upgrades (`docs/index.html`, `docs/app.js`, `docs/style.css`):**
  - **5-Mode Key-Free Basemap Switcher:** `Field Guide` (Esri Light Gray Canvas), `Transit & Rail` (ÖPNVKarte), `Topo` (Esri World Topo), `Night` (Esri Dark Gray Canvas), and `Street` (OSM).
  - **Full Table Directory View (`Map & Guide` | `Table Directory` | `Reading Room`):** Sortable, searchable, filterable full-width directory table with two-way links (`View in Table ⊞` from any stop dossier; `Locate on Map →` from any table row back to the map pin).
  - **Inline & Wikidata Entity Linkage:** 21 recurring historical entities (`Project MKUltra`, `Louis Jolyon "Jolly" West`, `CIA`, `FBI & COINTELPRO`, `Charles Manson & CHAOS`, `Jack Parsons & JPL`, `Scientology`, `Theosophical Movement`, etc.) are auto-linked inline in dossier narratives and rendered as interactive entity cards with cross-atlas filter buttons and direct `Wikipedia ↗` + `Wikidata Q-ID ↗` links.
  - **Mobile Responsive Controls:** Horizontal touch-scroll pills for basemap switcher, pin-type legend, and filter bar on small viewports.

## Pending, in priority order
1. Geocode and verify parcel/access details for the 6 priority LA deep-cut draft candidates in `research/candidate_research_records.csv` (`DC01` Superet, `DC02` Psychic Temple, `DC03` Continental Building, `DC04` Pisgah Home, `DC05` San Marino Birch office, `L11` Bank of Italy deposition stop) when ready to promote into `data/sites.csv`.
2. Perform primary source and parcel inspection for the remaining unmapped leads in `research/candidate_research_records.csv` (`SLA01`, `UCLA01`, `BPP01`, `UCLA02`, `MAN01`, `VEN01`).
3. If a copy or Table of Contents of *Codex Obscura* becomes available, drop it into `research/` to cross-check for any additional Southern California entries.
