# BioSins — Public Website

Public source for [www.biosins.com](https://www.biosins.com), a free biology-notes website.

Website code and assets copied from the private BioSins feature branch at commit `e6035cb607940252f82cbced1c71ec7592d09393`.

## Publication

GitHub Actions builds the static site from the repository root using Node.js 22 and `npm run build`, runs `npm test`, then publishes `dist/` through GitHub Pages.

The public site uses the custom domain `www.biosins.com`. Configure it in **Settings → Pages → Custom domain**. The domain must also have a `www` CNAME record pointing to `biosinse.github.io` in the domain DNS. GitHub Actions does not use a CNAME file to configure custom domains.

## Content status

CSIR Ecology A1–A3, the academic membrane reference page and UPESSC membrane revision page exist in the private-source snapshot.
UPESSC Assistant Professor subject navigation and Unit 06 Animal Physiology outline pages are included.
Original separately stored Word documents, unfinished teaching lessons and private internal planning files are intentionally not published here.

## Working locally

```bash
npm run build
npm test
```

Output goes to `dist/`.
