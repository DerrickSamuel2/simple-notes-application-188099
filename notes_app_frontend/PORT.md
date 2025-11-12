This app is configured to run on a port defined by the environment for both development and production:

- npm run dev          -> Wrapper starts Next dev on 0.0.0.0:$PORT (default 3000)
- npm run dev:preview  -> Same as dev; ignores extra args injected by preview tools
- npm start            -> Next production server on 0.0.0.0:$PORT (default 3000)

Notes:
- Development uses scripts/dev.js which sets HOST=0.0.0.0 via env and spawns "next dev -p $PORT" without forwarding any CLI args.
- This prevents unsupported flags like "--host" from reaching Next.js and respects preview-assigned PORT via env.
- When ready, Next.js logs: "ready - started server on 0.0.0.0:<port>".

If your platform injects a different port, set PORT in the environment. The wrapper will use it.
