---
name: commercial-window-route-scouting
description: Identifies, verifies, enriches, scores, deduplicates, and exports commercial window-cleaning prospects from Google Street View, Maps screenshots, roadside photos, mall directories, and existing customer records. Use when visually qualifying storefront glass, grouping route clusters, checking current tenants, finding public business contacts, distinguishing cold leads from current or former customers, or producing outreach-ready spreadsheet and CRM data.
---

# Commercial Window Route Scouting

## Purpose

Turn roadside or Google Street View photographs into a verified, route-ready commercial window-cleaning lead list.

This skill combines visual qualification, live web research, internal relationship checks, route-density scoring, contact enrichment, deduplication, and spreadsheet output.

The goal is not to collect every business. The goal is to find **workable glass**, identify who can authorise the work, and build compact routes worth travelling for.

## Core Principle

A business directory tells us that a business exists.

A photograph tells us whether the job is commercially worthwhile.

Prioritise:

- Several accessible panes over one small pane
- Multiple viable businesses in one block over isolated prospects
- Owner-operated or locally controlled premises over difficult national procurement paths
- Current tenants over stale Street View signage
- Existing or former customers over cold leads
- Written payer authority over counter-staff or informal bookings

## When to Use

Load this skill when the task includes any of the following:

- Identifying businesses from Google Street View, Maps screenshots, or roadside photos
- Finding commercial window-cleaning prospects by visually inspecting storefronts
- Scoring glass volume, access, frequency, route density, and local authority
- Building Hornby, Wigram, Sockburn, Lincoln, Rolleston, or other Christchurch route clusters
- Verifying current tenants where Google imagery or mall directories may be stale
- Enriching business records with public phone, email, website, address, and decision-maker details
- Checking Gmail, Google Contacts, Drive, or customer spreadsheets for existing relationships
- Separating active leads, current customers, former customers, historical signs, and problem accounts
- Updating a master lead workbook and producing CSV or Google Contacts import files

## Do Not Use

Do not use this skill for:

- Residential window-cleaning leads without commercial storefront qualification
- General business directories where photographs or route value are irrelevant
- Collecting private personal information
- Guessing unreadable signs or inventing current tenants
- Treating opening hours, reviews, map coordinates, products, or promotions as lead data
- Contacting a business before the authorised payer is identified when prior payment risk exists

## Inputs

Use as many of these as are available:

1. Street View or roadside photographs
2. Google Maps business pins or visible road names
3. Existing master workbook
4. Past customer CSV files
5. Gmail messages and booking records
6. Google Contacts
7. Google Drive business lists
8. Official business websites
9. Mall, precinct, or store directory pages
10. Current public directories when no official source exists

## Source Priority

Use sources in this order:

1. **User-provided customer history**
2. **Internal records**: Gmail, Contacts, Drive, past-customer sheets
3. **Official business website or official branch page**
4. **Official mall or precinct directory**
5. **Current company registry or reputable public directory**
6. **Google Maps / Street View signage**

Street View and mall directories are evidence, not final truth. They can contain closed businesses, former tenants, and old branding.

## End-to-End Procedure

### Step 1 — Register the Photo Batch

Create a batch identifier and preserve traceability.

Record:

- Batch name
- Route area
- Photograph number or group
- Screenshot filename if available
- Approximate capture date if shown
- User-supplied location clue
- Existing workbook version being updated

Do not discard duplicate angles. Consolidate them under one photo group while retaining the source references.

### Step 2 — Perform the Visual Pass

For every photograph:

1. Read every clearly visible business sign.
2. Separate primary tenants from sub-brands, product signs, and concessions.
3. Mark unreadable or uncertain signage as `Unverified sign`.
4. Note whether multiple photographs show the same frontage.
5. Estimate the visible pane band:
   - 1 pane
   - 2–3 panes
   - 4–6 panes
   - 7–10 panes
   - 10+ panes / corner / multi-level
6. Record access observations:
   - Ground-level or elevated
   - Clear pavement or obstructed
   - Parking/loading access
   - Awning or signage obstruction
   - Safe working area
7. Identify neighbouring businesses that form one practical stop.

Never guess a business name merely because the logo resembles a known brand.

### Step 3 — Establish the Route Cluster

Determine the actual road, precinct, or building.

Record:

- Exact street or complex name
- Street number or unit number
- Suburb and postcode
- Nearby anchor business
- Approximate travel relation to other leads

Keep similarly named locations separate. Example: `Lincoln Road – Spreydon` and `Vernon Drive – Lincoln` are different canvassing routes.

### Step 4 — Verify the Current Tenant

Search the live web because Street View may be historical.

Check:

- Official contact page
- Official branch or location page
- Store locator
- Mall or precinct `Our Stores` page
- About, team, owner, or manager page
- Header and footer contact details
- `mailto:` links
- Current company listing where needed

Classify each photographed name as:

- `Verified current`
- `Current tenant replacing photographed sign`
- `Historical / closed`
- `Sub-brand or concession — merge with main account`
- `Unverified`

If the current tenant differs from the photograph, retain both values:

- `Visible Business`
- `Current / Verified Business`

### Step 5 — Check Internal Relationship History

Before treating a record as a cold lead, search:

1. Gmail
2. Google Contacts
3. Google Drive
4. Past-customer and dropped-off customer CSV files
5. Existing workbook records

Classify the relationship:

- `Current customer — scheduled`
- `Current customer — irregular/on-demand`
- `Former customer — reactivation candidate`
- `Prior quote or enquiry`
- `Cold prospect`
- `Problem account / payment-authority risk`
- `Do not contact`

Internal history overrides cold-lead assumptions.

Do not infer private reasons for silence, closure, or payment difficulty. Record only known facts.

### Step 6 — Enrich the Public Business Record

Collect only outreach-relevant fields:

- Business name
- Contact or decision-maker name
- Role
- NZ-formatted phone
- Public business email
- Website
- Full address
- Route cluster
- Source URL
- Current status
- Relationship status
- Authority/payment note

Preferred decision-maker targets:

- Owner
- Franchise owner
- Store manager
- Venue manager
- Practice manager
- Centre director
- Operations manager
- Facilities/property manager

Do not retain opening hours, review ratings, prices, map coordinates, menus, or promotions.

### Step 7 — Normalise and Validate

#### Phone Numbers

Normalise New Zealand phone numbers to international format where practical.

Examples:

- `03 349 1234` → `+64 3 349 1234`
- `021 123 4567` → `+64 21 123 4567`
- `0800 123 456` remains `0800 123 456`

Preserve multiple verified numbers when they represent distinct contacts.

#### Emails

Validate against:

```regex
^[^\s@]+@[^\s@]+\.[^\s@]+$
```

Do not invent a branch email from a domain pattern.

#### Names and Addresses

- Fix casing
- Trim whitespace
- Remove non-contact metadata
- Preserve official trading names
- Record unit numbers where known

### Step 8 — Deduplicate and Merge

Treat records as duplicates when two or more of these match:

- Normalised business name
- Exact address or unit
- Phone number
- Email domain
- Official website domain

Merge rather than duplicate when:

- Several photos show the same business
- A product or concession sign belongs to the primary tenant
- Two health brands share one reception and tenancy
- Old and new tenants occupy the same photographed unit

Keep the historical name in the batch evidence, but append only the current verified tenant to the active master lead table.

### Step 9 — Score the Prospect

Use the **Commercial Window Prospect Score**.

#### A. Glass Score — 1 to 5

| Score | Visible glass value |
|---|---|
| 5 | Excellent: 10+ panes, corner glazing, broad continuous frontage, or multi-level glass |
| 4 | Strong: 6–9 useful panes or several large panels |
| 3 | Workable: 3–5 panes; worthwhile inside a route |
| 2 | Add-on only: 1–2 moderate panes |
| 1 | Skip: one small pane, very little glass, or poor commercial value |

#### B. Route Density Score — 1 to 5

| Score | Route value |
|---|---|
| 5 | Five or more worthwhile businesses in the same block or car park |
| 4 | Three or four worthwhile businesses within a short walk |
| 3 | Two businesses sharing one stop |
| 2 | One useful business near an existing route |
| 1 | Isolated prospect requiring a separate trip |

#### C. Access Score — 1 to 3

| Score | Access |
|---|---|
| 3 | Ground-level, clear frontage, safe access, easy parking |
| 2 | Some obstruction, awning, traffic, or minor access difficulty |
| 1 | Elevated, unsafe, heavily obstructed, or specialist equipment likely |

#### D. Cleaning Frequency Score — 1 to 3

| Score | Likely frequency |
|---|---|
| 3 | Café, restaurant, pharmacy, gym, liquor store, medical or high-footfall retail |
| 2 | Office, showroom, speciality retail, childcare, or moderate foot traffic |
| 1 | Warehouse, low-footfall office, or infrequent presentation need |

#### E. Local Authority Score — 1 to 3

| Score | Decision path |
|---|---|
| 3 | Owner-operated or named local manager with apparent authority |
| 2 | Franchise/branch manager may influence approval |
| 1 | National chain, landlord-controlled exterior, or formal procurement likely |

#### F. Risk Penalty — 0 to 3

| Penalty | Risk |
|---|---|
| 0 | No known payment or authority risk |
| 1 | Approval path unclear |
| 2 | Prior non-response, disputed scope, or stale tenant information |
| 3 | Prior unpaid invoice, explicit payment dispute, or do-not-book concern |

#### Formula

```text
Prospect Score = Glass + Route Density + Access + Frequency + Local Authority - Risk Penalty
```

Maximum score: 19.

#### Priority Bands

| Priority | Score | Meaning |
|---|---:|---|
| A | 15–19 | Strong glass, practical route, reachable decision-maker; contact first |
| B | 10–14 | Workable lead with a slower approval path or lower route value |
| C | 2–9 | Add-on only, historical, uncertain, low glass, or high risk |

A historical or closed business is always excluded from active outreach regardless of numerical score.

### Step 10 — Decide Whether the Trip Is Worthwhile

A route is normally workable when at least one condition is true:

- One Priority-A anchor plus two nearby add-ons
- Three or more Priority-B-or-better businesses in one stop
- Five or more viable storefronts in one compact block
- A current customer visit can be combined with two or more prospects
- The route is within roughly ten minutes and can be canvassed unit-by-unit in one visit

Avoid travelling for one small, uncertain, low-authority prospect.

### Step 11 — Write the Outputs

#### Batch Evidence Sheet

Include:

- Photo group
- Visible business
- Current verified business
- Address
- Phone
- Email
- Website
- Route cluster
- Trading status
- Pane band
- Glass score
- Route-density score
- Access score
- Frequency score
- Authority score
- Risk penalty
- Total prospect score
- Priority
- Decision-maker target
- Relationship/customer history
- Source URL
- Notes

#### Master Lead Table

Append only current, verified, deduplicated active accounts.

Recommended columns:

`Route | Business | Business Type | Address | Phone | Email | Website | Relationship Status | Authority / Payment Risk | Glass Score | Prospect Score | Priority | Enrichment Status | Decision-Maker Target | Source URL | Notes`

#### CSV Export

Minimum outreach-ready columns:

`Business/Contact Name | Phone | Email | Website | Address | Route Cluster | Glass Score | Prospect Score | Priority | Enrichment Status | Source URL`

#### Optional Google Contacts Import

Create a Google Contacts-compatible CSV when direct contact creation is unavailable.

Use a group such as:

`Commercial Window Leads`

### Step 12 — Verify Before Handoff

Before presenting the result:

- Confirm every active record has a source URL
- Confirm live status for any sign photographed more than six months ago
- Check for duplicate business/address combinations
- Check email syntax
- Check NZ phone formatting
- Confirm current customers are not labelled cold prospects
- Confirm historical signs are excluded from the active master list
- Confirm sub-brands are not double-counted
- Confirm payment-authority warnings are retained
- Inspect the workbook for formula errors
- Export to a new versioned filename
- Report the number of photo records, current active leads, duplicates merged, historical records, and customer records corrected

## Outreach Handoff Rules

### Current Customer

Use a relationship-led check-in:

- Mention prior service
- Ask whether the windows need refreshing
- Offer a simple recurring cadence
- Keep on-call service available

### Cold Local Owner-Operated Lead

Lead with:

- The specific storefront or route
- A practical recurring option
- Easy local service
- A clear written price and scope

### Franchise or Chain

Before service:

- Identify the authorised franchise owner or branch manager
- Confirm whether the landlord controls exterior glass
- Obtain written price and scope approval
- Confirm who will pay the invoice

### Problem Account

Do not dispatch again without:

- Authorised payer name
- Written scope
- Agreed price
- Written approval
- Clear invoice recipient

## Anti-Hallucination Rules

- Do not guess unreadable signs.
- Do not assume photographed signage is current.
- Do not invent emails, owner names, unit numbers, or phone numbers.
- Do not state suspected cash-flow problems as fact.
- Do not call a record verified when only a low-trust directory supports it.
- Do not count the same tenancy twice because two brands are visible.
- Do not hide uncertainty; use `Unverified`, `Historical`, or `Recheck required`.

## Definition of Done

The task is complete only when:

- Every photograph has been inspected
- Every clear business sign has been recorded
- Duplicate angles are consolidated
- Current tenants are verified
- Internal customer history has been checked
- Contact fields are normalised and validated
- Active leads are deduplicated
- Scores and priorities are calculated
- Historical or closed businesses are excluded from active outreach
- The master workbook and focused CSV are exported
- The output is ready for route planning, outreach, spreadsheet import, or CRM import
