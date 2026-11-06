# Session Handoff — 2026-11-06

## Accomplished
- Unpacked `research/conspiracy-book-club-deep-cuts-2026-11-06.zip` into `research/deep-cuts-research-2026-11-06/` (`README.md`, `RESEARCH.md`, `findings.csv`).
- Audited `research/SoCal Field Guide Taxonomy & Dossier.pdf` against `research/deep-cuts-research-2026-11-06/RESEARCH.md`, `findings.csv`, `data/sites.csv`, and `data/research_leads.csv`.
- Created `research/candidate_research_records.csv` (19 records: `DC01`–`DC08`, `DC04_GRANDE`, `L11`–`L14`, and `SLA01`, `UCLA01`, `BPP01`, `UCLA02`, `MAN01`, `VEN01`) using Python's `csv` module, resolving all flagged issues:
  - Blackburn deposition at Bank of Italy Building (`505 W. 7th Street, Suite 530`) dated to **December 1929** (not 1930 or 649 S. Olive St), preserving the 1931 conviction reversal (*People v. Blackburn*, 214 Cal. 402).
  - Continental Building (`408 S. Spring Street`) recorded strictly as a 1944–1946 **ownership/asset connection** (`Moderate` historical support, no deed inspected; not leased executive HQ), preserving the 1947 reversal (*Bell v. United States*).
  - Psychic Temple / Holy Kiss Society recorded at **228 E. Broadway, Long Beach** with William C. Price and the `224–230 E. Broadway` frontage reconciliation note (rejecting the PDF's fabricated `217 E. 4th St` / "William Ferguson").
  - General Birch Services recorded at **2627 Mission Street, San Marino (1975)** from inspected letterhead (rejecting the PDF's `395 Concord Rd / Huntington Dr`).
  - Kept Pisgah Grande (`DC04_GRANDE`) separate from both Highland Park's Pisgah Home (`DC04`) and Blackburn (`L11`).
  - Excluded duplicate Jolly West candidate (`C13` in PDF) in favor of existing `H29` (UCLA NPI institutional context) and `H30` (UCLA Library Special Collections archive access).
  - Deferred historical/geographic support ratings and legal-outcome assertions on uninspected prompt threads (`UCLA01`, `BPP01`, `UCLA02`, `MAN01`, `VEN01`) and fixed `MAN01` CSV quoting; kept all candidate coordinates blank and `publish=False`.
- Updated `L11`–`L14` in `data/research_leads.csv` with the supplement's findings and source links while preserving `SD01`–`SD10`.
- Created `research/TAXONOMY_PROPOSAL.md` documenting the faceted map taxonomy, conceptual distinctions, filter logic (`OR` within topics, `AND` across facets, `Parapolitics` as a curated preset), and crosswalk table.

## Pending, in priority order
1. Geocode and verify parcel/access details for the 6 priority draft candidates (`DC01` Superet, `DC02` Psychic Temple, `DC03` Continental Building, `DC04` Pisgah Home, `DC05` San Marino Birch office, `L11` Bank of Italy deposition stop) when ready to merge into `data/sites.csv` (reconciling with the shared Google Sheet first).
2. Perform primary source and parcel inspection for the additional prompt threads (`SLA01`, `UCLA01`, `BPP01`, `UCLA02`, `MAN01`, `VEN01`) before promoting any to draft candidates.
3. Visual QA of the interactive map on `http://127.0.0.1:8000` (desktop + mobile, filter counts: All 72, Bars 28, Jolly West 2, Castaneda 2, Checked 2).
4. Continue the workflow in `research/WORKFLOW.md`: uMap layer import, static vintage field-guide poster map, and GitHub Pages configuration.

## Files modified / added
- `research/deep-cuts-research-2026-11-06/` — unpacked vetted supplement (`README.md`, `RESEARCH.md`, `findings.csv`).
- `research/candidate_research_records.csv` — reconciled 19-record candidate CSV (`publish=False`, blank coordinates).
- `research/TAXONOMY_PROPOSAL.md` — faceted taxonomy specification and crosswalk.
- `data/research_leads.csv` — updated `L11`–`L14` status, next steps, and reference URLs.
- `HANDOFF.md` — updated session state.
