This app is configured to run on port 3000 for both development and production:

- npm run dev       -> Next dev server on 0.0.0.0:3000
- npm run dev:start -> Alias to run dev without extra args injected by preview tools
- npm start         -> Next production server on 0.0.0.0:3000

Notes:
- We explicitly set HOST=0.0.0.0 and PORT=3000 via cross-env in package.json so the server binds to all interfaces.
- Avoid passing additional flags like --host or --port from the preview runner. If your platform appends args (e.g., npm run dev -- --port ... --host ...), use "npm run dev:start" instead, which does not accept extra args.
- When ready, Next.js logs: "ready - started server on 0.0.0.0:3000".

If your platform injects a different port, set PORT in the environment or adjust the -p flag in package.json.
