# agentx.icu

The public home for agentx.icu — a small workshop for open-source, privacy-first communication tools.

- Live site: <https://agentx.icu/>
- GitHub organisation: <https://github.com/agentx-icu>
- Projects: [toxee](https://toxee.agentx.icu/) · [MorseCQ](https://morsecq.agentx.icu/) · [DitMesh](https://ditmesh.agentx.icu/)

## Local preview

This is a framework-free static site. Serve the repository root with any static server, for example:

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080/>. The language switch remembers a visitor's choice in local storage and supports `?lang=en` / `?lang=zh`.

## GitHub Pages deployment

The `main` branch is deployed by `.github/workflows/pages.yml` using the official Pages artifact and deployment actions. In the repository settings:

1. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Add `agentx.icu` as the custom domain if it is not picked up from `CNAME`.
3. At the DNS provider, point the apex domain to GitHub Pages' published A/AAAA records (or use a `www` CNAME as appropriate). Keep HTTPS enforcement enabled after the certificate is issued.

The workflow intentionally publishes the repository root as-is: no build step or third-party runtime is required. `tools/` is published too; it holds only the check script and the social preview template.

`.github/workflows/check.yml` runs `python3 tools/check_site.py` on every push and pull request. It fails when a local file or `#anchor` referenced by `index.html` or `404.html` is missing, when an English string has no Chinese counterpart, when the JSON-LD is not valid JSON, or when a project card's platform tags differ from that project's `operatingSystem` in the JSON-LD.

## Languages

Every visible string exists twice, as `<span class="en">` and `<span class="zh">`; CSS shows the one matching `data-lang` on `<html>`. Without JavaScript the page shows English. `assets/main.js` also switches the document title and description, and points the "Visit site" and footer project links at each project's `/en/` or `/zh/` page.

The page follows the system light or dark setting. The hero constellation and the project artwork stay dark in both themes.

## Social preview and icons

`assets/og.jpg` (1200×630) is a screenshot of `tools/og.html`. After changing the template, render it again with Playwright or a headless browser at a 1200×630 viewport and save it as a JPEG. `assets/favicon-64.png`, `assets/apple-touch-icon.png` (180×180) and `assets/icon-512.png` are renders of `assets/favicon.svg`; the two larger ones drop the rounded corners because iOS and Android apply their own mask.

## Content and links

Project cards link to each project's existing website and GitHub repository. This repository does not modify project code or their existing domain bindings. When a project's description or supported platforms change, update its card, the `hasPart` entry in the JSON-LD, and the matching node in `tools/og.html`.
