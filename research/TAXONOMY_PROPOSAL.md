# Faceted Map Taxonomy & Schema Proposal

Prepared November 6, 2026. This specification proposes a non-exclusive, multi-faceted taxonomy for the Conspiracy Book Club and Social Aid and Pleasure Club interactive atlas (`docs/`), keeping topic tags separate from location role, claim status, evidentiary support, and access level.

It does **not** alter the current `data/sites.csv` build pipeline until approved for implementation.

---

## 1. Core Conceptual Distinctions

- **Documented Conspiracies & Covert Operations (`documented_conspiracies`):** State, intelligence, corporate, or organizational covert actions established through declassified government records, congressional inquiries, or judicial findings (e.g., MKULTRA subprojects, FBI COINTELPRO operations, the White House Plumbers' break-in at Dr. Lewis Fielding's office).
- **Conspiracy Beliefs & Narratives (`conspiracy_beliefs`):** Sites associated with organizations, authors, or movements that formulated, published, or popularized conspiracy theories attributing historical events to hidden cabals, without implying those theories are empirically true (e.g., Mankind United's "Hidden Rulers" doctrine, John Birch Society publishing hubs).
- **Parapolitics (Curated Preset View, not an exclusive tag):** In scholarship (following Peter Dale Scott), *parapolitics* studies the structural conduct of covert agencies, intelligence networks, and clandestine political actors operating outside public oversight; in popular usage, it often blurs into general conspiracy theory. Rather than making `parapolitics` a competing single category, the UI should offer **Parapolitics** as a **curated filter preset** combining `documented_conspiracies`, `intelligence_research`, and `political_violence`.
- **Political Organizing & State Repression (`political_organizing`):** Headquarters, bookstores, meeting halls, campaign events, and surveillance targets of political movements across the spectrum (e.g., General Birch Services office, Hsi Lai Temple 1996 campaign-finance episode). Keeping this distinct from `political_violence` avoids mislabeling publishing offices or fundraising sites as violent sites.
- **Political Violence (`political_violence`):** Sites of assassinations, armed sieges, bombings, and lethal police/organizational clashes (e.g., RFK assassination at the Ambassador Hotel `H07`, SLA May 1974 shootout `SLA01`, Campbell Hall 1969 killings `UCLA01`, December 1969 LAPD SWAT raid on Black Panther HQ `BPP01`).
- **Crime & Legal History (`crime_legal`):** Sites of documented criminal acts, indictments, depositions, trials, and appellate reversals established in legal records (e.g., Blackburn December 1929 Bank of Italy deposition `L11`, McMartin Preschool `H27`, UCLA Engineering IV 2016 shooting `UCLA02`). *Distinction from "True Crime":* "True crime" is a commercial media genre often driven by sensational speculation; `crime_legal` tracks bounded legal proceedings, including overturned convictions (*People v. Blackburn*, *Bell v. United States*).
- **Religious & Esoteric Movements (`religious_esoteric`):** Churches, temples, retreats, and sanctuaries of novel spiritual, New Thought, Pentecostal, Theosophical, or contactee movements (e.g., Superet Light Church `DC01`, Pisgah Home `DC04`, Angelus Temple `H20`, Krotona `H13`/`H42`). Inclusion records religious history, not misconduct.
- **Occultism & Spiritual Experimentation (`occult_spiritual`):** Ritual magic orders, mediumship circles, alchemy, séance sites, and esoteric lodges (e.g., The Parsonage `H10`, Builders of the Adytum `H14`, Houdini séance at the Knickerbocker `H21`, Besant Lodge / Ecclesia Gnostica `DC07`).
- **Communal Experiments & Counterculture (`communal_counterculture`):** Intentional utopian colonies, communal living experiments, and countercultural gathering spaces (e.g., Synanon `H02`, The Source `H05`, Spahn Ranch `H09`, Pisgah Home/Grande `DC04`, Venice Beat venues `VEN01`).
- **Arts, Music, & Literary History (`arts_music`):** Creative studios, performance venues, literary workplaces, and residences where cultural production intersected with the guide's themes (e.g., Philip K. Dick archive `H41`, Dennis Wilson's 1968 Sunset Blvd residence `MAN01`, Venice West Cafe `VEN01`).
- **Intelligence, Surveillance, & Research Institutions (`intelligence_research`):** Think tanks, defense facilities, military radar/film sites, and psychiatric/academic research centers (e.g., RAND `H01`, Lookout Mountain Laboratory `H04`, San Vicente Nike site `H25`, Santa Susana Field Lab `H26`, Jolly West UCLA NPI context `H29` and archive `H30`).
- **Folklore, Disputed Stories, & Urban Legends (`folklore_legends`):** Rumors, disputed subterranean/compound lore, and unverified popular tales attached to real places (e.g., Fort Moore Hill Lizard People story `H24`, embellished Murphy Ranch myths `H03`).

---

## 2. Top-Level Topic Toggles (Slugs & Rules)

| Topic Slug | User Label | Definition | Inclusion Rules | Exclusion Rules | Boundary Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `documented_conspiracies` | Documented Conspiracies | Declassified or court-verified covert operations and illicit state/organizational plots. | Primary government, congressional, or court verification (e.g., MKULTRA, COINTELPRO, Plumbers break-in). | Unverified theories, routine police patrols, or ideological books. | **Campbell Hall (`UCLA01`):** Included for documented FBI COINTELPRO memos targeting BPP/US friction, while noting trial records on the shooting itself. |
| `conspiracy_beliefs` | Conspiracy Beliefs | Sites tied to movements or publishers that promoted conspiracy narratives. | Documented headquarters, asset holdings, or presses of conspiracy-theory movements. | Verified covert operations (`documented_conspiracies`). | **Continental Bldg (`DC03`):** Included for Arthur Bell / Mankind United's 1944–46 ownership connection. |
| `political_organizing` | Political Organizing | Political movement offices, bookstores, fundraising sites, and organizing hubs. | Dated organizational offices, campaign finance episodes, or activist HQs. | Non-political religious or artistic venues. | **Birch Office (`DC05`):** Included here and in `conspiracy_beliefs` (not `political_violence`). |
| `political_violence` | Political Violence | Assassinations, armed sieges, shootouts, and violent repression. | Lethal political clashes, SWAT sieges, and political assassinations. | Non-political workplace or personal violence (`crime_legal`). | **SLA 54th St (`SLA01`):** Included as an armed political siege and fatal shootout. |
| `crime_legal` | Crime & Legal History | Sites of major crimes, depositions, indictments, and landmark trials. | Verified criminal incidents, legal deposition stops, or prosecutions (including reversed convictions). | Sensational gossip or uncorroborated accusations. | **UCLA Eng IV (`UCLA02`):** Included strictly under `crime_legal` (and `memorial_site` role), without conspiracy tags. |
| `religious_esoteric` | Religious & Esoteric | Novel spiritual movements, faith-healing missions, Theosophy, and UFO religions. | Documented sanctuaries, headquarters, and retreat grounds of alternative religious movements. | Mainstream congregations without esoteric or novel doctrinal history. | **Superet Light Church (`DC01`):** Included for Mother Trust's Atom-Aura Christian sanctuary. |
| `occult_spiritual` | Occult & Ritual | Ritual magic orders, mediumship, séances, and Gnostic/hermetic lodges. | Ceremonial magic sites, séance hotels, and occult lodges. | Purely philanthropic shelters or secular think tanks. | **Besant Lodge (`DC07`):** Included alongside `religious_esoteric` for Theosophical/Ecclesia Gnostica liturgy. |
| `communal_counterculture` | Communes & Counterculture | Utopian colonies, intentional communities, and Beat/hippie gathering nodes. | Communal settlements, counterculture restaurants, and shared compounds. | Standard single-family residences or commercial offices. | **Pisgah Home (`DC04`):** Bridges early Pentecostal faith healing and cooperative communal welfare. |
| `arts_music` | Arts, Music & Literature | Studios, venues, literary offices, and residences tied to cultural history. | Documented creative venues, literary workplaces, or music-history intersections. | Generic celebrity homes with no connection to the guide's themes. | **Blackburn Bank of Italy Stop (`L11`):** Primarily `crime_legal`/`religious_esoteric`, with secondary literary context via Raymond Chandler's Dabney oil office in the same building. |
| `intelligence_research` | Intelligence & Research | Defense think tanks, military labs, psychiatric research centers, and archives. | Verified defense, intelligence, aerospace, or psychiatric institutions and their archives. | Unverified rumor sites without institutional history. | **Jolly West (`H29` / `H30`):** Tagged `intelligence_research` and `documented_conspiracies`, with `location_role` distinguishing `organizational_office` (`H29`) from `archive` (`H30`). |
| `folklore_legends` | Folklore & Disputed Lore | Urban legends, disputed stories, and local mythologies tied to physical sites. | Places where popular lore significantly exceeds or diverges from the historical record. | Straightforward court or archival findings. | **Fort Moore Hill (`H24`):** Tagged `folklore_legends` for the 1934 Lizard People tunnel story. |

---

## 3. Orthogonal Metadata Dimensions (Kept Separate from Topic Slugs)

1. **`location_role`:** `event_site` | `residence` | `organizational_office` | `ownership_connection` | `performance_venue` | `archive` | `memorial_site` | `landscape` | `bar`
2. **`claim_status`:** `established_finding` | `documented_allegation` | `participant_account` | `investigative_argument` | `folklore_legend` | `unresolved`
3. **`historical_support`:** `Strong` | `Moderate` | `Limited` | `Deferred` (always paired with a prose reason)
4. **`geographic_support`:** `Strong` | `Moderate` | `Limited` | `Deferred` (always paired with a prose reason)
5. **`access_level`:** `public_exterior` | `scheduled_access` | `active_institution` | `private_property` | `demolished_site` | `unresolved`
6. **`publication_status`:** `existing_map` | `ready_next_export` | `hold` | `retired` (plus `publish=False` on all research queue candidates)
7. **`checked`:** Boolean (`true` only for `H07` Ambassador site and `B02` HMS Bounty unless updated by an actual club visit)
8. **`optional_bar_id`:** Stable reference to a `B##` record (geographic circuit pairing only, never proof of historical involvement)

---

## 4. Worked Taxonomy Crosswalk (Existing Records + Reconciled Candidates)

| ID | Name | Legacy `category` | Proposed `topics` | `location_role` | `claim_status` | Hist. Support | Geo. Support | `access_level` | Bar Pairing |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H01** | RAND — former headquarters | History / Research | `intelligence_research`, `documented_conspiracies` | `organizational_office` | `established_finding` | Strong | Strong | `demolished_site` | `B01` |
| **H09** | Spahn Ranch site | History / Research | `communal_counterculture`, `crime_legal` | `landscape` | `established_finding` | Strong | Moderate | `public_exterior` | `B06` |
| **H29** | Jolly West — UCLA NPI context | Jolly West | `intelligence_research`, `documented_conspiracies` | `organizational_office` | `established_finding` | Strong | Strong | `active_institution` | — |
| **H30** | Jolly West papers — UCLA Library | Jolly West | `intelligence_research`, `documented_conspiracies` | `archive` | `established_finding` | Strong | Strong | `scheduled_access` | — |
| **B01** | Chez Jay | Bar | `arts_music` | `bar` | `established_finding` | Strong | Strong | `active_institution` | — |
| **DC01** | Superet Light Church / Mother Trust | *(Candidate)* | `religious_esoteric` | `organizational_office` | `established_finding` | Strong | Strong | `active_institution` | `B02` |
| **DC02** | Psychic Temple / Holy Kiss Society (228 E. Broadway) | *(Candidate)* | `religious_esoteric`, `crime_legal` | `organizational_office` | `established_finding` | Strong | Strong | `private_property` | `B21` |
| **DC03** | Continental Building / Mankind United (408 S. Spring St) | *(Candidate)* | `conspiracy_beliefs`, `crime_legal` | `ownership_connection` | `investigative_argument` | Moderate | Strong | `public_exterior` | `B14` |
| **DC04** | Pisgah Home Historic District (Highland Park) | *(Candidate)* | `religious_esoteric`, `communal_counterculture` | `organizational_office` | `established_finding` | Strong | Strong | `public_exterior` | `B08` |
| **DC05** | General Birch Services (2627 Mission St, San Marino, 1975) | *(Candidate)* | `conspiracy_beliefs`, `political_organizing` | `organizational_office` | `established_finding` | Strong (dated) | Moderate | `public_exterior` | — |
| **L11** | Blackburn Bank of Italy Deposition Stop (505 W. 7th St, Dec 1929) | *(Candidate)* | `crime_legal`, `religious_esoteric`, `occult_spiritual` | `event_site` | `investigative_argument` | Moderate | Strong (bldg) | `public_exterior` | `B10` |
| **SLA01** | SLA Shootout & Fire Site (1466 E. 54th St, May 1974) | *(Candidate)* | `political_violence`, `crime_legal` | `event_site` | `established_finding` | Strong (address/photo); Deferred (details) | Moderate (address); Deferred (parcel) | `private_property` | — |
| **UCLA01** | UCLA Campbell Hall — Carter & Huggins Killings (Jan 1969) | *(Candidate)* | `political_violence`, `political_organizing`, `crime_legal`, `documented_conspiracies` | `event_site` | `established_finding` | Deferred (pending primary/court check) | Strong (bldg); Deferred (room) | `active_institution` | — |
| **BPP01** | LAPD Central Ave Black Panther HQ Raid (Dec 1969) | *(Candidate)* | `political_violence`, `political_organizing`, `crime_legal` | `event_site` | `established_finding` | Deferred | Deferred | `unresolved` | — |
| **UCLA02** | UCLA Engineering IV — June 1, 2016 Shooting | *(Candidate)* | `crime_legal` | `memorial_site` | `established_finding` | Deferred | Strong (bldg) | `active_institution` | — |
| **MAN01** | Dennis Wilson / Manson 1968 Sunset Blvd Thread | *(Candidate)* | `arts_music`, `communal_counterculture`, `crime_legal` | `residence` | `established_finding` | Deferred | Deferred | `private_property` | — |
| **VEN01** | Venice Beat Venues (Gas House / Venice West Cafe) | *(Candidate)* | `arts_music`, `communal_counterculture` | `performance_venue` | `established_finding` | Deferred | Deferred | `public_exterior` | — |

---

## 5. Filter Behavior & Plain-JS / GeoJSON Migration Notes

1. **OR within Topics, AND across Facets:**
   - Selecting multiple topic toggles (e.g., `religious_esoteric` + `occult_spiritual`) matches any site tagged with **either** topic (`OR`).
   - Combining topic toggles with **Region**, **Location Role** (e.g., `archive` or `bar`), **Access Level**, or **Checked** filters applies strict **`AND`** intersection.
2. **Single Pin per Feature:**
   - Each place renders as a single GeoJSON feature and marker on the Leaflet map regardless of how many `topics` it carries. Primary marker color continues to distinguish **History/Research**, **Jolly West**, **Castaneda**, **Bars**, and **Checked** stops; topic badges render inside the detail card and sidebar list.
3. **Backward-Compatible CSV/GeoJSON Migration (When Approved):**
   - Retain existing `category` (`History`, `Bar`, `Jolly West`, `Castaneda`) so current tests and uMap color rules never break.
   - Add semicolon-delimited `topics` and single-value `location_role`, `claim_status`, `historical_support`, `geographic_support`, and `access_level` columns in `data/sites.csv`, which `tools/export_geojson.py` can split into a JSON array `properties.topics` alongside the existing properties.
