# harikube.info

Website content of HariKube

# HariKube.info

This project uses a containerized Hugo setup with Tailwind CSS and Node.js tools. The development environment is fully reproducible using `Docker` and a simple `Makefile`.

## 🚀 Quick Start

### 1. Clone the Repository

Make sure you include submodules:

```bash
git clone --recurse-submodules ssh://git@github.com:HariKube/harikube.info.git
cd harikube.info
```

If you already cloned it without --recurse-submodules, run:

```bash
git submodule update --init --recursive
```

### 2. Available Makefile Commands

🔧 make shell

Launch an interactive shell inside the Docker container with the project mounted:

```bash
make shell
```

Useful for running manual commands or debugging inside the Hugo+Node environment.

▶️ make run

Install dependencies and start the development server (usually on http://localhost:38080):

```bash
make run
```

This is the main target for local development.

🛠️ make gen

Build static assets using the npm run build command:

```bash
make gen
```

🔌 make validate

Validate website content:

```bash
make validate
```

### 3. Running Service

Once release action published OCI image you can run website via `Docker`

```bash
docker run --rm --name harikube.info -d -p 7000:80 mhmxs/harikube.info:dev-v0.0.1
```

### Documentation experience

- Documentation uses the local `layouts/_default/simple.html` override, with navigation in `layouts/partials/docs-nav.html` and the Docs menu in `hugo.toml`.
- Set `applies_to` in a guide's front matter for release-specific requirements. `prevLink`/`prevTitle` and `nextLink`/`nextTitle` control its sequence links. Site reference versions are informational, not compatibility guarantees.
- Hugo generates `/search-index.json` from docs, features, topics, and blog pages. The docs search downloads it only when a visitor enters at least two characters; no hosted search service is used.
- Optional analytics and marketing scripts belong in the inert `optional-tracking` template in the footer. Do not add them as eager scripts: `static/js/cookiebar.js` loads them only after explicit consent.

After a production Hugo build, run these checks against its destination:

```bash
python3 scripts/check-seo.py public
python3 scripts/check-homepage.py public
python3 scripts/check-experience.py public
```

The SEO check expects a production base URL (`hugo --baseURL https://harikube.info/`). Browser checks for keyboard navigation, search, mobile layouts, and consent remain a separate manual/integration step. The quick start's deployment commands require a disposable Kubernetes environment; the static-site checks do not execute them.

### 4. Preview Action

[Preview action](https://gitea.mhmxs.duckdns.org/readynas/harikube.info/actions?workflow=preview.yml&actor=0&status=0) runs on each non release branches if the commir message contains `+PV`. The action prints the URL of the preview, so navigate into the action run, and unfold `Print URL` step. Use the password found next to the URL.