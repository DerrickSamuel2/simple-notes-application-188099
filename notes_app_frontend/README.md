# Notes App Frontend (Next.js)

Modern, lightweight notes UI using Next.js App Router and a clean Ocean Professional theme.

## Getting Started

From the notes_app_frontend directory:

- Development (binds to 0.0.0.0:$PORT, default 3000):
  - npm run dev
- Development (preview-safe; avoids unsupported flags like --host):
  - npm run dev:preview
- Build:
  - npm run build
- Start (production server, binds to 0.0.0.0:3000):
  - npm start

The dev and start scripts set HOST=0.0.0.0 and PORT=3000 via cross-env and pass "-p 3000" to Next.js. You should not pass "--host" or other extraneous flags; use dev:preview if your runner injects extra args.

Open http://localhost:3000 to view.

## Theme

Global styles live in app/globals.css, tuned for the Ocean Professional look.

## Components

Core UI components are in app/components and src/components, and localStorage-backed services are in src/services.
