# Building applications

Redium applications use Vite for the development server and production bundle.
Redium's command forwards directly to Vite, so the familiar Vite options and a
`vite.config.ts` file continue to work.




An application needs an `index.html` containing a module entry point:

```html
<!doctype html>
<html lang="en">
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## Development

```bash
npx redium dev
```

This starts Vite's development server, including TypeScript transforms and
hot-module reload. In a project that uses the standard scripts, `npm run dev`
does the same thing.

## Production

```bash
npx redium build
```

This creates a production-ready `dist/` directory. Vite bundles and minifies
the TypeScript entry modules, rewrites `index.html` to point at hashed output
assets, and copies imported files such as images, fonts, and models. Redium
also evaluates each production entry during the build and emits its generated
style rules as a hashed CSS asset linked from the output HTML; lifecycle hooks
do not run during this collection pass. Serve the contents of `dist/` with any
static host.

Use `npx redium preview` to inspect that production build locally.

The command accepts ordinary Vite options. For example:

```bash
npx redium build --outDir site-build
npx redium dev --host
```

## Library contributors

This repository has two different builds:

```bash
npm run build          # Build the application selected by index.html
npm run build:library  # Create Redium's publishable ESM, CommonJS, and .d.ts files
```

`npm test` runs `build:library` automatically. The application build is not a
replacement for the package build; it is the command Redium users run for their
own sites.
