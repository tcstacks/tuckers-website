# Public static site

This is the only app intended for internet deployment. It contains the public content page and no admin routes or write APIs.

Build from the repository root with:

```bash
npm run build:static
```

The static output is `static-site/out`. For Cloudflare Pages, keep the repository root as the project root, use `npm run build:static` as the build command, and use `static-site/out` as the output directory. This keeps the root `package.json` and shared published data available during the build.

The published content is read from `data/site-content.json`. The local editor can update that file; commit the change and push it to publish a new static build.
