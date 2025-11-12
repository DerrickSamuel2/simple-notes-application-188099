# Next.js Migration Notes

This frontend has been migrated from Create React App to Next.js (App Router).

How to run:
- Development: npm run dev (http://localhost:3000)
- Build: npm run build
- Start: npm start (http://localhost:3000)

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
