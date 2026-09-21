# What's New at Autodesk — personalized for your organization

A customer-facing web app that helps Autodesk customers discover recent Autodesk product, platform and AI updates across AEC, Design & Manufacturing, and Media & Entertainment — filtered by industry, role, products and business priorities, and shareable inside their organization with persona-specific summaries.

Live in 30 seconds: open the link, complete the sentence *"Show updates for [industry] relevant to [role] who uses [products] and cares about [priorities]"*, and the page reorders around that person.

---

## What's inside

```
autodesk-whats-new/
├── index.html                      # the whole application (HTML + CSS + JS, no build step)
├── data/
│   ├── updates.js                  # ← THE ONLY FILE YOU EDIT to add or change updates
│   └── updates.json                # generated copy of the same data, for tooling/analytics
├── scripts/
│   └── validate.js                 # checks the data file and regenerates updates.json
├── .github/workflows/
│   └── validate-content.yml        # CI: validates data and checks source links on every change
└── README.md
```

Features: industry / role / product / priority personalization, search, sort by relevance or latest, release-status and AI-only filters, featured updates, detail view with source and recommended next step, "Add to share" collection, persona-specific summaries (Executives, Transformation & BIM/VDC, Project managers, Technical, IT & platform) in Email / Teams / plain-text formats, copy-to-clipboard, mailto, print-to-PDF, shareable URLs that restore any view, empty states and error-safe data loading. Responsive from 320px up; keyboard accessible; respects reduced-motion.

---

## Publish to GitHub Pages (about 5 minutes)

1. Create a new repository on GitHub (e.g. `autodesk-whats-new`). Public is required for free GitHub Pages.
2. Upload the contents of this folder (drag-and-drop in the GitHub web UI works), or from a terminal:
   ```bash
   cd autodesk-whats-new
   git init && git add . && git commit -m "Initial publish"
   git branch -M main
   git remote add origin https://github.com/<your-user-or-org>/autodesk-whats-new.git
   git push -u origin main
   ```
3. In the repository go to **Settings → Pages**. Under **Build and deployment** choose **Deploy from a branch**, select **main** and **/ (root)**, then **Save**.
4. After about a minute your site is live at  
   `https://<your-user-or-org>.github.io/autodesk-whats-new/`
5. Share that URL. Every filter, opened update and share selection is encoded in the URL, so you can send a customer a pre-personalized link, for example:  
   `…/autodesk-whats-new/?industry=aec&role=bim-manager&products=Revit,Forma&priorities=ai`

No build step, no framework, no server, no cookies, no tracking.

### Run locally

Double-click `index.html`, or serve the folder so the URL-based sharing behaves exactly as on Pages:
```bash
npx serve .          # or: python3 -m http.server 8080
```

---

## Keep the content current (maintenance model)

Every card comes from one entry in `data/updates.js`. To add an update:

1. Copy any existing entry and change the fields. The field guide is at the top of the file.
2. Use only **publicly available Autodesk sources** (Autodesk News, product blogs, Autodesk Help release notes, APS blog). Never paste internal, NDA or roadmap material — the app is customer-facing.
3. Set `releaseStatus` honestly: `released` · `announced` · `preview` · `coming` · `strategic`. Use `releaseDate` = the public announcement or release date.
4. Run `node scripts/validate.js`. It rejects unknown role/outcome ids, non-Autodesk source URLs, bad dates and missing fields, then regenerates `data/updates.json`. The same check runs in GitHub Actions on every push or pull request, and also verifies that source links resolve.
5. Commit. GitHub Pages redeploys automatically.

Tips
- Keep `featured: true` to 5–7 direction-setting items; move older ones off featured rather than deleting them.
- To retire an entry without breaking links people may have shared, set `customerSafe: false` (it disappears from the UI but its id remains valid).
- Don't rename an `id` after publishing — shared links use it.
- Product names in `products` drive the product filter; keep them consistent (e.g. always "Forma Data Management", not "Docs").
- Persona ids and business-outcome ids are defined once, in the `T` object near the top of the `<script>` in `index.html`. Add roles or outcomes there if the taxonomy needs to grow.

A quarterly rhythm works well: after each major Autodesk moment (spring product releases, DevCon, SIGGRAPH, AU) add 5–10 entries and re-check `preview`/`coming` items that may have shipped.

---

## Architecture decision

| Option | Verdict |
|---|---|
| **Plain HTML/CSS/JS (chosen)** | Zero build, zero dependencies, deploys to Pages from the repo root, opens from a file share or SharePoint too. A non-developer can maintain content by editing one JS file. The dataset (tens to a few hundred items) is small enough for instant client-side filtering. |
| React + Vite | Good DX but adds a build step, `node_modules`, a `base` path config for Pages, and an Actions workflow just to publish. Not justified for a single-page catalog. |
| Next.js | Server features are unused; static export adds the most configuration for the least benefit here. |
| Astro / Eleventy | Reasonable, but still a build toolchain for something that doesn't need one. |

Content is separated from the UI (`data/updates.js`), so if the catalog later grows large or needs CMS-style editing, the same data model can move to JSON files consumed by a static-site generator without redesigning the app. Data is loaded as a script rather than fetched as JSON so the app also works when opened directly from a file (`file://`), where `fetch()` is blocked by browsers.

---

## Information architecture

- **Industries:** AEC · Design & Manufacturing · Media & Entertainment (an update may belong to several).
- **Persona taxonomy** (four groups, 36 roles): Executive · Business & transformation · Technical · IT & platform.
- **Business outcomes:** AI enablement, Productivity, Automation, Collaboration, Data management, Interoperability, Cloud workflows, Platform & APIs, Digital twins & operations, Sustainability, Quality, Cost reduction, Risk reduction, Visualization.
- **Release status:** Recently released · Newly announced · Preview/beta · Coming soon · Existing, strategically important.
- **Relevance model:** each entry has a base `relevanceScore` (strategic significance, breadth of customers affected, workflow impact). At runtime the app adds recency (up to +12), industry match (+10), role match (+28 primary / +14 secondary / +6 same group), product matches (up to +24) and priority matches (up to +24). Cards show *why* they matched ("Matches your role · Revit").
- **Sharing lenses:** each recipient type has a set of emphasized outcomes and a closing "suggested action"; an entry can optionally carry recipient-specific "why it matters" text in its `angles` field (the six featured entries do).

---

## Optional: privacy-conscious analytics

The core app collects nothing. If you want to learn which industries, roles, updates and share actions customers use most, add a cookieless, aggregate-only tool — e.g. Plausible or a self-hosted Umami — with a single script tag in `index.html`, and send custom events from the existing handlers (`update()`, `openDrawer()`, `openShare()`). Avoid any tool that sets tracking cookies or captures IP-level identifiers without consent, and say what you collect in the footer. Keep analytics out of the repository's default build so the "clean" version can always be shared.

---

## Optional: automated content ingestion (proposal, not implemented in V1)

Design principle: **automation proposes, a human publishes.** A scheduled GitHub Action could:

1. Fetch approved public feeds — Autodesk News category pages/feeds, the AEC/Construction/AutoCAD/Fusion/Forma/M&E product blogs, the Autodesk Platform Services blog, and per-product "What's New" pages on Autodesk Help.
2. Diff against `data/updates.json` by source URL.
3. For new items, draft entries in the schema (optionally with an AI summarization step that must cite the source text).
4. Open a **pull request** containing the drafted entries. Nothing is published until a person reviews language, release status, dates and customer-safety, then merges.

The validator and link-checker already in `.github/workflows/validate-content.yml` would run on that PR. Verify each feed URL before wiring it in; several Autodesk blogs are WordPress-based and expose `/feed/`, but this must be confirmed per site.

---

## Version 2 ideas

- Saved personal views (stored in the browser only) and "what changed since my last visit".
- Per-update short videos or demo links, and Autodesk University class links.
- Regional availability notes and language variants.
- Product-family landing pages with deep links from Autodesk account teams.
- An "ask about these updates" panel using the Autodesk Product Help MCP or a retrieval layer over `updates.json`.
- CSV export of the current view for customers who manage change internally in spreadsheets.

---

## Accuracy and customer safety

All entries are written from public Autodesk sources and dated by public announcement or release. Release status reflects Autodesk's communications at the time of writing; preview and "coming soon" items can change, and the footer says so. Nothing internal, confidential or NDA-restricted belongs in this repository.
