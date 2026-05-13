#!/usr/bin/env node
// Generates Vercel Build Output API v3 structure from TanStack Start's Vite build.
//
// TanStack Start v1 (Vite Environments API) does not have a built-in Vercel preset.
// It outputs:
//   dist/client/   → static JS/CSS bundles
//   dist/server/   → SSR Edge Function bundle (exports default { fetch })
//
// This script packages those outputs into the format Vercel auto-detects:
//   .vercel/output/static/              ← static assets served at their URL paths
//   .vercel/output/functions/index.func/ ← Edge Function handling all SSR requests
//   .vercel/output/config.json          ← routing: static first, then SSR catch-all

import { cpSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'

const STATIC_DIR = '.vercel/output/static'
const FUNC_DIR = '.vercel/output/functions/index.func'
const CONFIG_PATH = '.vercel/output/config.json'

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

// Server bundle — deployed as a Vercel Edge Function
// TanStack Start's server entry exports `default { fetch }`, which is
// the Web API handler format that Vercel's Edge Runtime accepts natively.
cpSync('dist/server', FUNC_DIR, { recursive: true })

writeFileSync(
  `${FUNC_DIR}/.vc-config.json`,
  JSON.stringify({ runtime: 'edge', entrypoint: 'server.js' }, null, 2),
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
