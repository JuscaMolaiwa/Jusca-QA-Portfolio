# Jusca Molaiwa — QA Engineer Portfolio

[![GitHub Pages](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-0d1117?style=flat&logo=github&logoColor=00e5a0)](https://jusca.pythonanywhere.com/)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=flat)](./LICENSE)

A personal portfolio for **Jusca Molaiwa**, Software Quality Assurance Engineer based in Johannesburg, ZA. The site showcases 5+ years of QA experience, live automation demos, projects, skills, certifications, and contact details.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Automation Demo Backend](#automation-demo-backend)
- [Scripts Reference](#scripts-reference)
- [Styles Reference](#styles-reference)
- [Recent Improvements](#recent-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
Jusca-QA-Portfolio/
├── index.html                  # Main entry point (static)
├── images/                     # Icons, profile photo, logos
├── projects/
│   └── assets/                 # CV PDF and certificate images
├── styles/                     # One CSS file per section/concern
│   ├── mainstyles.css
│   ├── navigationstyles.css
│   ├── herostyles.css
│   ├── aboutstyles.css
│   ├── resumestyles.css
│   ├── projectstyles.css
│   ├── skillstyles.css
│   ├── automation-demo.css
│   ├── feedbackform.css
│   ├── educationstyles.css
│   ├── contactstyles.css
│   ├── bugstyles.css
│   └── burgermenustyles.css
├── scripts/                    # One JS file per feature
│   ├── main.js                 # Scroll, nav, fade-up, back-to-top
│   ├── burgermenu.js           # Mobile drawer open/close
│   ├── bug.js                  # Bug icon animation
│   ├── automation-demos.js     # Login test trigger
│   ├── automation-demo-place-order.js  # Place order test trigger
│   ├── form.js                 # Feedback form submit
│   └── bump_asset_version.py   # Cache-busting version bumper
└── automation-demos/           # Flask + Selenium backend
    ├── web_automation_app.py   # Flask app entry point
    ├── Dockerfile
    └── docker-compose.yml
```

---

## Getting Started

### View locally (static frontend)

The homepage is fully static. No build step or server required.

```bash
# Clone the repo
git clone https://github.com/JuscaMolaiwa/Jusca-QA-Portfolio.git
cd Jusca-QA-Portfolio

# Open in browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

> **Note:** JavaScript must be enabled. The burger menu, test buttons, feedback form, and scroll animations all require it.

### Cache-busting (after updating CSS/JS)

After changing any stylesheet or script, run the version bumper to prevent browsers from serving stale cached files:

```bash
python3 scripts/bump_asset_version.py
```

This appends a UTC timestamp `?v=YYYYMMDDHHMMSS` to all `styles/*.css` and `scripts/*.js` references in `index.html`.

---

## Automation Demo Backend

The `automation-demos/` folder contains a **Flask + Selenium** application that triggers headless browser automation and returns results (screenshots, videos, logs, reports) to the frontend.

The live backend is hosted at: `https://jusca.pythonanywhere.com`

### Endpoints

| Method | Endpoint           | Description                               |
|--------|--------------------|-------------------------------------------|
| `POST` | `/run-login-test`  | Runs automated Saucedemo login test       |
| `POST` | `/place-order`     | Runs automated Saucedemo place-order test |
| `POST` | `/submit-feedback` | Saves user feedback to MySQL              |

### Run locally (Docker — advanced)

> This setup requires Docker and may need adjustments for driver paths, ports, and environment variables before it runs locally.

```bash
cd automation-demos
docker compose up --build
```

Once running, the reverse proxy is available at `http://localhost:8080`.

### Requirements

- Firefox or Chrome + matching WebDriver (geckodriver / chromedriver)
- MySQL for feedback storage — update connection settings in `web_automation_app.py`
- Environment-specific CORS origins may need updating

---

## Scripts Reference

| File                             | Purpose                                                                                         |
|----------------------------------|-------------------------------------------------------------------------------------------------|
| `main.js`                        | Active nav highlighting, smooth scroll, fade-up animations, back-to-top, certs view-more toggle |
| `burgermenu.js`                  | Mobile nav drawer — open, close, ESC key, resize handling                                       |
| `bug.js`                         | BugHunter logo click animation (`.running` class on bug icon)                                   |
| `automation-demos.js`            | Fetches `/run-login-test`, shows result + artifact links                                        |
| `automation-demo-place-order.js` | Fetches `/place-order`, shows result + artifact links                                           |
| `form.js`                        | Feedback form show/hide and JSON POST to `/submit-feedback`                                     |
| `bump_asset_version.py`          | Bumps `?v=` cache-busting query string on all local assets                                      |

---

## Styles Reference

| File                   | Covers                                                          |
|------------------------|-----------------------------------------------------------------|
| `mainstyles.css`       | Reset, CSS variables, base typography, buttons, footer, fade-up |
| `navigationstyles.css` | Sticky nav, desktop nav list, mobile drawer, overlay            |
| `herostyles.css`       | Hero layout, profile photo, spinning ring, stats row            |
| `aboutstyles.css`      | About grid, highlight cards                                     |
| `resumestyles.css`     | Resume download card                                            |
| `projectstyles.css`    | Project cards, badges                                           |
| `skillstyles.css`      | Skills grid, pill tags                                          |
| `automation-demo.css`  | Demo cards, run buttons, status messages, artifact links        |
| `feedbackform.css`     | Feedback form show/hide, inputs, submit button                  |
| `educationstyles.css`  | Education cards, cert list, view-more toggle                    |
| `contactstyles.css`    | Contact icon badges, hover effects                              |
| `bugstyles.css`        | Bug icon `@keyframes bugRun` animation                          |
| `burgermenustyles.css` | `body.no-scroll` lock when drawer is open                       |

---

## Recent Improvements

### Design & UI
- Complete dark-theme redesign — deep navy (`#0d1117`) with electric teal (`#00e5a0`) accent
- New hero section with animated dashed profile photo ring and stats row
- Skills rebuilt as interactive pill tags; projects and certs as proper cards with hover effects
- Scroll-triggered fade-up animations on all content sections

### Accessibility
- Skip-to-content link for keyboard users
- `aria-label`, `aria-expanded`, `aria-controls` on all interactive elements
- `role="list"` on navigation, `role="banner"` on header
- Mobile viewport allows user zoom (`user-scalable=yes`)

### Performance
- Removed duplicate Font Awesome stylesheet load
- Non-critical images lazy-loaded (`loading="lazy"`)
- All scripts deferred (loaded at end of `<body>`)
- `bump_asset_version.py` prevents stale cache serving

### Code quality
- Inline styles and scripts extracted into dedicated CSS/JS files
- Feedback form uses JSON POST — no native `<form>` submit
- `automation-demos.js` and `automation-demo-place-order.js` guard against missing DOM elements
- `burgermenu.js` exposes `toggleDrawer()` / `closeDrawer()` globally for inline HTML compatibility

### SEO & Social
- `<meta name="description">`, Open Graph, and Twitter Card tags
- JSON-LD structured data (`Person` schema)
- `rel="noopener noreferrer"` on all external links

---

## Contributing

- Keep HTML semantic — use landmarks (`<header>`, `<main>`, `<section>`, `<article>`), proper heading hierarchy, and descriptive labels.
- One concern per file — add new styles to the relevant `styles/*.css` file, not inline.
- Run `bump_asset_version.py` after any CSS/JS change before committing.
- If modifying automation demos, test in the containerized environment to preserve portability.

---

## License

© 2025 Jusca Molaiwa. All rights reserved.

Third-party libraries and icons are subject to their respective licenses:
- [Font Awesome](https://fontawesome.com/license) — Free tier, CC BY 4.0
- [Google Fonts](https://fonts.google.com) — SIL Open Font License
- [Syne](https://fonts.google.com/specimen/Syne) & [DM Sans](https://fonts.google.com/specimen/DM+Sans) — OFL