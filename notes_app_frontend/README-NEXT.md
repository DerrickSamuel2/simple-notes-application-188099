# Next.js Migration Notes

This frontend has been migrated from Create React App to Next.js (App Router).

How to run:
- Development: npm run dev (binds to 0.0.0.0:$PORT, default 3000; wrapper ignores extra args)
- Development (preview-safe): npm run dev:preview (same as dev; prevents preview runners from appending extra args)
- Build: npm run build
- Start: npm start (binds to 0.0.0.0:3000)

Port/Host:
- We set HOST=0.0.0.0 and PORT=3000 via cross-env in package.json.
- Do not pass unsupported flags like --host. If your platform automatically appends them (e.g., npm run dev -- --port ... --host ...), use "npm run dev:preview" instead.
- Readiness log: Next.js will print "ready - started server on 0.0.0.0:3000" when dev server is healthy.

Routes:
- /           -> Notes list with search, create, edit, delete (modal)
- /notes/new  -> Create a new note
- /notes/[id] -> View/edit/delete a single note

Theme:
- Ocean Professional theme preserved via app/globals.css. Theme preference is stored in localStorage key "APP_THEME" and applied as [data-theme] attribute on <html>.

Environment variables:
- If you surface variables to the client, use NEXT_PUBLIC_* prefixes.
- Existing REACT_APP_* variables are preserved in the environment, but to access them in the browser, define NEXT_PUBLIC_* equivalents.

Notes data:
- Currently uses localStorage-based services in src/services/*. For a backend, adapt src/services/notesApi.js to call your API.

Troubleshooting (stale chunk/module errors):
- If you encounter an error like "Cannot find module './682.js' from .next/server/webpack-runtime.js", clean the build output and caches, then re-run:
  - npm run dev:clean    # removes .next and node_modules/.cache, then starts dev
  - npm run rebuild      # removes caches then runs a fresh next build
- Ensure no code imports from '.next' or relies on build-time chunk names (this project does not).
- Avoid experimental webpack customizations that could affect chunking (none are used here).
