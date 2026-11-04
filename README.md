# Sunstead Solar

A no-build, static website concept for an off-grid solar provider serving households and businesses. The site uses plain HTML, CSS, and JavaScript and can be previewed locally or hosted on GitHub Pages.

## Brand name ideas

The site currently uses **Sunstead Solar** as a working name: warm, calm, and home-oriented. Other directions to consider:

- **Brightstead Energy** — dependable, welcoming, and easy to extend beyond solar.
- **Daymark Solar** — modern and optimistic, with a clear energy cue.
- **Luntian Current** — locally resonant; *luntian* means green in Filipino.
- **SolHaven Energy** — emphasizes comfort and resilience.
- **Goodlight Solar** — friendly, direct, and easy to remember.

These are creative suggestions only; check business-name, trademark, domain, and social-handle availability before choosing one.

## Preview

Open `index.html` in a browser. There are no package installs, build steps, or runtime image requests. Scroll-linked fade/slide/scale reveals cover the page content, and the hero image, headline, payment label, and caption move at different rates for a pronounced parallax effect. Motion updates smoothly with scroll position in both directions on desktop and mobile, and respects reduced-motion preferences. Optimized solar photos are stored locally in `assets/`; the supplied WhatsApp images and archive are kept in the project folder but are not included in the public Pages deployment.

### Bundle photo credits

- **Home Essentials:** “A House with Solar Panel on the Roof” by Robert So, [Pexels](https://www.pexels.com/photo/a-house-with-solar-panel-on-the-roof-12243093/).
- **Home Independence:** “Solar Panels on House Roof” by Budget Bizar, [Pexels](https://www.pexels.com/photo/solar-panels-on-house-roof-17762230/).
- **Business Continuity:** “Solar Technicians Installing Solar Panels” by Hoan Ngọc, [Pexels](https://www.pexels.com/photo/solar-technicians-installing-solar-panels-6961122/).

The bundle images are illustrative stock photos showing solar equipment; they are not photos of Sunstead Solar installations or a promise of specific equipment.

## Customize before publishing

1. Choose and verify a business name, then update the page title, copy, and logo text in `index.html`.
2. In `script.js`, set `CONTACT_EMAIL` to an inbox you monitor. The contact form uses the visitor’s configured email app; it does not send or store submissions on a server.
3. Replace the illustrative system ranges and payment-plan language with verified offerings. The bundle matcher is a conversation starter, not a technical sizing tool or quote.
4. Add verified phone, location, service coverage, and any approved product photography if you want to show them.

## Publish on GitHub Pages

This project is intended to live in its own public GitHub repository, `sunstead-solar`, rather than in a parent workspace repository. Once created under your account, its URL will be `https://ACCOUNT.github.io/sunstead-solar/` and will remain the same for future updates pushed to `main`.

The included `.github/workflows/pages.yml` deploys the static site to GitHub Pages on pushes to `main`. In the repository, select **Settings → Pages → GitHub Actions** as the deployment source. The `.gitignore` keeps local WhatsApp files, editor settings, and the scratch image out of the public repository.
