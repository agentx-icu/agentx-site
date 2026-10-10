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

The workflow intentionally publishes the repository root as-is: no build step or third-party runtime is required.

## Content and links

Project cards link to each project's existing website and GitHub repository. This repository does not modify project code or their existing domain bindings.
