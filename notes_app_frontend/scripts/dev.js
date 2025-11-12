#!/usr/bin/env node
/**
 * Dev server wrapper to harden Next.js startup under preview runners.
 * - Reads PORT from env (default 3000)
 * - Forces HOST=0.0.0.0 via env (no '--host' CLI flag)
 * - Spawns 'next dev -p $PORT' and ignores any extra npm/preview CLI args
 * - Logs effective host/port for observability
 *
 * This avoids failures when preview systems append unsupported flags like '--host'
 * and ensures the port used is the one from the environment (e.g., PORT=3001).
 */

import { spawn } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine port from env with default
const DEFAULT_PORT = 3000;
const envPort =
  (process.env.PORT && Number.parseInt(String(process.env.PORT), 10)) || DEFAULT_PORT;
const port = Number.isFinite(envPort) ? envPort : DEFAULT_PORT;

// Prepare environment: ensure HOST, disable telemetry
const env = {
  ...process.env,
  HOST: process.env.HOST || '0.0.0.0',
  NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED || '1',
};

// Build command and args
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['next', 'dev', '-p', String(port)];

// Log effective configuration
const host = env.HOST || '0.0.0.0';
console.log(`[dev] Starting Next.js dev server...`);
console.log(`[dev] HOST=${host} PORT=${port}`);
console.log(`[dev] Command: next dev -p ${port}`);

// Spawn next dev without forwarding any extra args
const child = spawn(cmd, args, {
  stdio: 'inherit',
  env,
  cwd: process.cwd(),
  shell: false,
});

// Handle child process exit
child.on('close', (code, signal) => {
  if (signal) {
    console.error(`[dev] Dev server terminated with signal: ${signal}`);
    process.exit(1);
  }
  if (code !== 0) {
    console.error(`[dev] Dev server exited with code: ${code}`);
    process.exit(code || 1);
  }
  process.exit(0);
});

// Propagate termination signals
const terminate = () => {
  if (child && !child.killed) {
    try {
      child.kill('SIGTERM');
    } catch {
      // ignore
    }
  }
};
process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);
