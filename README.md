# StretchSense Gaming — Shopify Theme

Custom Shopify theme for the **StretchSense Gaming** storefront, built on **Horizon** and extended with a purple-branded design system, dedicated gaming sections, and an SDK downloads flow gated to authenticated customers.

**Live theme ID:** `157644521671`
**Store:** stretchsense-gaming.myshopify.com

---

## 🎨 Project overview

This theme powers the direct-to-consumer sales page for the **Reality XR Glove** (single product with 4 size variants: XS, S, M, L). It combines standard Shopify commerce with:

- Custom gaming-branded homepage (hero → features → tech specs → comparison → testimonials → buy card → CTA)
- Post-purchase SDK access via a login-gated downloads page
- Product size guide modal driven by metafields
- Framer-parity Privacy Policy + Terms of Service pages
- Full purple brand color system (replaces theme's default orange/neutral tones)

---

## 🧱 Tech stack

| Layer | Choice |
|-------|--------|
| **Base theme** | Shopify Horizon |
| **Templating** | Liquid |
| **Styling** | Section-scoped `{% stylesheet %}` (sections) + inline `<style>` (blocks/snippets) |
| **Deploy** | GitHub Actions → Shopify CLI |
| **Product integration** | Stork-up → Shopify → Zoho (single-direction sync) |

---

## 📁 Custom sections (this repo's work)

| Section file | Purpose |
|--------------|---------|
| `sections/hero-gaming.liquid` | Hero with gradient headline, price, CTAs |
| `sections/features-bar.liquid` | 4-card feature strip with images + icons |
| `sections/tech-specs-strip.liquid` | 8-column icon + stat grid (sensors, battery, bluetooth, etc.) |
| `sections/feels-different.liquid` | Intro + Controllers-vs-Gloves comparison table + Personas grid |
| `sections/gameplay-demo-grid.liquid` | 4-column VR game thumbnail grid (VRChat, Beat Saber, etc.) |
| `sections/testimonials-youtube.liquid` | 4-column creator testimonial cards |
| `sections/whats-included-buy.liquid` | What's Included list + sticky buy card with variant picker |
| `sections/ready-experience-cta.liquid` | Ready-to-experience CTA with platform logos |
| `sections/header-gaming.liquid` | Sticky header with mobile hamburger + submenu system |
| `sections/footer-gaming.liquid` | Branded footer with newsletter + social links |
| `sections/product-showcase.liquid` | Product page hero |
| `sections/guarantee-bar.liquid` | Trust badges strip |

## 🧩 Custom blocks

| Block file | Purpose |
|------------|---------|
| `blocks/size-guide.liquid` | Purple gradient Size Guide button + modal, reads `custom.size_guide_image` metafield. Works on product page and inside Featured Product section |

## 📎 Custom snippets

| Snippet | Purpose |
|---------|---------|
| `snippets/size-guide.liquid` | Legacy size guide snippet (use the block above for new deployments) |

## 📄 Custom templates

| Template | Purpose |
|----------|---------|
| `templates/page.downloads.liquid` | Login-gated SDK downloads page. Shows purchased products' downloadable assets. |

---

## 🎨 Brand color system

| Token | Hex | Usage |
|-------|-----|-------|
| Primary purple | `#a855f7` | Buttons, borders, primary CTAs |
| Light purple | `#c084fc` | Hover states, gradients, accents |
| Pink accent | `#ec4899` | Gradient endpoints, highlights |
| Deep purple | `#7c3aed` | Occasional accents |
| Cyan (stats) | `#22d3ee` | Numerical stat displays |

Gradient CTA pattern: `linear-gradient(135deg, #a855f7 0%, #ec4899 100%)`

---

## 🗄️ Required product metafields

Set per product under **Products → [product] → Metafields**:

| Namespace / Key | Type | Purpose |
|-----------------|------|---------|
| `custom.size_guide_image` | File (Image) | Size chart image shown in Size Guide modal |
| `custom.sdk_download_url` | Single-line text | URL to the SDK download for this product |
| `custom.sdk_version` | Single-line text | Version label displayed on downloads page |

---

## 🛠️ Local development

### Prerequisites

- Node.js 22+
- Shopify CLI installed globally: `npm install -g @shopify/cli@latest`
- Authenticated to the store: `shopify login --store stretchsense-gaming.myshopify.com`

### Run local preview

```bash
shopify theme dev
```

Opens a live-reloading local preview using the current git branch's code + the live store's data. Any edits to `.liquid` / `.css` files sync instantly.

### Available Claude Code plugins

- **Shopify AI Toolkit** (`shopify-ai-toolkit@claude-plugins-official`) — 20+ skills for Liquid validation, docs search, GraphQL schema queries

---

## 🚀 Deploy pipeline

Deploys are handled by **GitHub Actions** (`.github/workflows/deploy.yml`).

### Trigger

Pushes to `main` automatically deploy to the live theme (`157644521671`).

### Deploy command

```bash
shopify theme push --theme 157644521671 --allow-live --nodelete \
  --ignore="templates/*.json" \
  --ignore="templates/customers/*.json" \
  --ignore="config/settings_data.json" \
  --ignore="config/markets.json" \
  --ignore="sections/*-group.json"
```

### What's ignored (protected from git overwrite)

| File pattern | Why |
|--------------|-----|
| `templates/*.json` | Theme editor drag-drop content (homepage layout, product page blocks) |
| `templates/customers/*.json` | Customer account templates |
| `config/settings_data.json` | Theme editor global settings (colors, fonts, custom CSS) |
| `config/markets.json` | Shopify Markets (currencies, languages) |
| `sections/*-group.json` | Header + footer block ordering |

These files are also listed in `.gitignore` and `.shopifyignore`.

---

## 🌿 Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — deploys to live theme on push |
| `sync/pull-live-theme` | Used for capturing direct-admin code edits back into git |
| `redesign/*` | Feature branches for major redesign work |

### Workflow for new features

```bash
git checkout -b feature/my-change
# ...make edits...
git add . && git commit -m "..."
git push -u origin feature/my-change
# Open PR on GitHub → review → merge to main → auto-deploys
```

### Workflow for pulling admin code edits back to git

```bash
git checkout main && git pull
git checkout -b sync/pull-live-YYYY-MM-DD
shopify theme pull --live
git diff  # review what changed
git add . && git commit -m "Sync direct-admin edits from live theme"
git push
```

---

## ⚠️ Admin vs. code editing rules

**Edit in code (this repo):**
- New sections/blocks/snippets
- Structural refactors
- CSS/JS refactors
- Anything that should be reviewable via PR

**Edit in Shopify admin (theme editor):**
- Homepage section order + block content
- Section settings (colors, text, product picker values)
- Product page Custom Liquid block wiring
- Global theme settings (color schemes, fonts)
- Product metafields

**Never mix both:** if editing Liquid, do it in one place per file to avoid overwrites.

---

## 🛡️ Safety notes

- **Never** `git checkout` a file after `shopify theme pull` without first inspecting the diff
- **Never** `--no-verify` on commits or `--force` push to main
- **Never** manually edit `.json` files in `templates/` or `config/settings_data.json`
- CI/CD uses `--nodelete` so files removed from git are NOT removed from live

---

## 🚨 Emergency rollback

If a bad merge breaks live:

```bash
git checkout main
git revert HEAD          # reverts the merge commit
git push origin main     # CI redeploys the previous version
```

---

## 📚 Related docs

- Shopify Horizon docs: https://shopify.dev/docs/storefronts/themes
- Shopify Liquid reference: https://shopify.dev/docs/api/liquid
- Shopify metafields guide: https://shopify.dev/docs/apps/build/custom-data/metafields
- Shopify CLI: https://shopify.dev/docs/api/shopify-cli

---

## 🤝 Contributing

1. Branch from `main`
2. Make focused, single-topic commits
3. Open a PR — CI runs a preview deploy to a review theme
4. Merge to `main` → auto-deploys to live

For questions, contact Tariq Manon (digital@tulip-tech.com).
