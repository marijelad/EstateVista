# EstateVista — Real Estate Portfolio Website

EstateVista is a fictional multi-page real-estate platform built for a public front-end portfolio. It uses only HTML, CSS, JavaScript, JSON, and original local SVG artwork. No build step, framework, API key, or backend is required.

## Features

- 30+ responsive pages
- 12 full property detail pages with local galleries
- Live property filters
- Favorites persisted with `localStorage`
- Side-by-side comparison for up to 3 properties
- Mortgage payment calculator
- Neighborhood and agent profile pages
- Demo inquiry forms with local-only confirmation
- CSS reveal animations and responsive navigation
- Original SVG property, neighborhood, hero, and agent illustrations
- GitHub Pages friendly relative paths

## Run locally

Open `index.html` directly, or use a simple local server. The JSON-driven favorites/compare views work best through a local server because browsers can restrict `fetch()` on `file://` URLs.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

Push the folder contents to a repository and enable GitHub Pages from the repository settings. No environment variables are needed.

## Demo disclaimer

All properties, addresses, agents, prices, market figures, and contact details are fictional. The site is a portfolio demonstration only.
