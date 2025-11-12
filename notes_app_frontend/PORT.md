This app is configured to run on port 3000 for both development and production:

- npm run dev          -> Next dev server on 0.0.0.0:3000
- npm run dev:preview  -> Preview-safe dev command (ignores extra args injected by preview tools)
- npm start            -> Next production server on 0.0.0.0:3000

Notes:
- We explicitly set HOST=0.0.0.0 and PORT=3000 via cross-env in package.json so the server binds to all interfaces.
- Do not pass unsupported flags like --host. If your platform appends args (e.g., npm run dev -- --port ... --host ...), use "npm run dev:preview" instead to avoid failures.
- When ready, Next.js logs: "ready - started server on 0.0.0.0:3000".

If your platform injects a different port, set PORT in the environment or adjust the -p flag in package.json.
