# Jusca QA Portfolio

A personal portfolio for Jusca Molaiwa, Software Quality Assurance Engineer. The site showcases experience, projects, skills, education, and interactive automation demos.

## What’s inside

- Static site (HTML/CSS/JS) in the project root, entry point: `index.html`
- Automation demo backend (Flask + Selenium) under `automation-demos/`
- Frontend scripts for real-time test triggers in `scripts/`
- Styles organized in `styles/`

## View locally

You can open `index.html` directly in your browser:

- macOS Finder: Double‑click `index.html`
- Terminal (optional):
  - `open index.html`

The homepage is fully static; interactive features (menu, test buttons) require JavaScript enabled.

## Automation demos (backend)

The `automation-demos` folder contains a Flask application that triggers headless browser automation for demo purposes. It is designed for a containerized environment and may require additional setup (browsers, drivers, MySQL) to run locally.

- Folder: `automation-demos/`
- Entry: `web_automation_app.py`
- Container: `Dockerfile`, `docker-compose.yml`

Notes:

- The app expects system binaries (Firefox/Chrome, geckodriver/chromedriver) and writes artifacts to specific paths.
- Some absolute paths and CORS origins are environment-specific and may need updating before local use.
- MySQL is used for feedback storage; connection settings are placeholders.

### Quick start (containerized) — advanced users

This setup is provided as a reference. It may require adjustments for ports, volumes, and driver paths.

```bash
# From the repository root
cd automation-demos
# Build and start
docker compose up --build
```

Once up, the reverse proxy is exposed on <http://localhost:8080> (if the compose stack starts successfully).

## Recent improvements

- Accessibility: allow zooming on mobile, added skip link, ARIA labels for navigation, consistent link labels.
- SEO: meta description, Open Graph and Twitter Card tags, structured data (Person).
- Performance: removed duplicate Font Awesome load, lazy-loaded non-critical images, deferred scripts.
- HTML validity: fixed invalid `div` inside `ul` in navigation; kept class semantics.
- Security: added `rel="noopener noreferrer"` to external links.

## Contributing

- Keep HTML semantic and accessible (landmarks, headings, labels).
- Prefer small, focused CSS and JS changes.
- If changing automation demos, consider container runtime and portability.

## License

This project’s code is © 2024–2025 Jusca Molaiwa. All rights reserved. Icons and third‑party libraries are subject to their respective licenses.
