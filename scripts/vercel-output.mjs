#!/usr/bin/env node
// Generates Vercel Build Output API v3 structure from TanStack Start's Vite build.
//
// TanStack Start v1 (Vite Environments API) does not have a built-in Vercel preset.
// It outputs:
//   dist/client/   → static JS/CSS bundles
//   dist/server/   → SSR bundle (exports default { fetch })
//
// This script packages those outputs into the format Vercel auto-detects:
//   .vercel/output/static/              ← static assets served at their URL paths
//   .vercel/output/functions/index.func/ ← Node.js Function handling all SSR requests
//   .vercel/output/config.json          ← routing: static first, then SSR catch-all
//
// We use nodejs22.x (not edge) because bundled dependencies (e.g. recharts → d3)
// reference node:stream and other Node.js built-ins that Edge Runtime forbids.
// A thin adapter.js bridges the { fetch } handler format to Node.js (req, res).

import { cpSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'

const STATIC_DIR = '.vercel/output/static'
const FUNC_DIR = '.vercel/output/functions/index.func'
const CONFIG_PATH = '.vercel/output/config.json'

// Adapts TanStack Start's `default { fetch }` export to a Node.js (req, res) handler.
const ADAPTER = `\
import { Readable } from 'node:stream';
import server from './server.js';

export default async function handler(req, res) {
  const proto = (req.headers['x-forwarded-proto'] ?? 'https').split(',')[0].trim();
  const host = req.headers['x-forwarded-host'] ?? req.headers['host'] ?? 'localhost';
  const url = new URL(req.url, \`\${proto}://\${host}\`);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) for (const val of v) headers.append(k, val);
    else if (v != null) headers.set(k, v);
  }

  const method = req.method ?? 'GET';
  const hasBody = !['GET', 'HEAD'].includes(method.toUpperCase());
  const request = new Request(url.toString(), {
    method,
    headers,
    body: hasBody ? Readable.toWeb(req) : null,
    ...(hasBody ? { duplex: 'half' } : {}),
  });

  const response = await server.fetch(request, process.env, {});

  res.statusCode = response.status;
  for (const [k, v] of response.headers.entries()) res.setHeader(k, v);

  const buf = await response.arrayBuffer();
  res.end(Buffer.from(buf));
}
`

if (!existsSync('dist/client') || !existsSync('dist/server')) {
  console.error('Error: dist/client or dist/server not found. Run vite build first.')
  process.exit(1)
}

// Clean and recreate Vercel output directory
if (existsSync('.vercel/output')) {
  rmSync('.vercel/output', { recursive: true, force: true })
}
mkdirSync(STATIC_DIR, { recursive: true })
mkdirSync(FUNC_DIR, { recursive: true })

// Static client assets (JS/CSS bundles) — served at their root URL paths
cpSync('dist/client', STATIC_DIR, { recursive: true })

// Server bundle + adapter — deployed as a Vercel Node.js Serverless Function
cpSync('dist/server', FUNC_DIR, { recursive: true })
writeFileSync(`${FUNC_DIR}/adapter.js`, ADAPTER)

// package.json marks the function directory as ESM so Node.js can load the ESM adapter
writeFileSync(
  `${FUNC_DIR}/package.json`,
  JSON.stringify({ type: 'module' }, null, 2),
)

writeFileSync(
  `${FUNC_DIR}/.vc-config.json`,
  JSON.stringify(
    { runtime: 'nodejs22.x', handler: 'adapter.js', launcherType: 'Nodejs' },
    null,
    2,
  ),
)

// Routing: serve static files first, route everything else through SSR
writeFileSync(
  CONFIG_PATH,
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: 'filesystem' },
        { src: '/(.*)', dest: '/' },
      ],
    },
    null,
    2,
  ),
)

console.log('✓ .vercel/output generated (Build Output API v3)')
