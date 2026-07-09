# Site administration

The root app is the local editor. The separately built `static-site` app is the only artifact intended for internet deployment; it contains the public page and no admin routes or write APIs.

Run the local editor with `npm run dev`, then visit `/admin`. Build the publishable site with `npm run build:static`; the deployable output is `static-site/out`.

## Configuration

Set these environment variables in local development and in the deployed environment:

```text
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=a-long-random-secret
```

Copy `.env.example` to `.env.local` for local development. Never commit `.env.local` or production credentials.

## Content storage and publishing

Published content is stored in `data/site-content.json`. Admin saves are written atomically, and the public page reads that shared file on every request.

After editing locally, commit and push `data/site-content.json`, then rebuild `static-site` to publish the latest content. The static build reads that JSON at build time.

The local editor storage requires a persistent, writable filesystem. It is not part of the public static deployment.

## Admin workflow

1. Visit `/admin` and sign in.
2. Edit any field in the content document.
3. Changes autosave, or use **Save** explicitly.
4. Use **Preview** to save and return to the public site.
5. Use **Sign out** when finished.

The editor also supports JSON backup downloads, imports, and restoring the source defaults.
