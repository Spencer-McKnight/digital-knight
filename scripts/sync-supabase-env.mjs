#!/usr/bin/env node
// =============================================================================
// scripts/sync-supabase-env.mjs
// -----------------------------------------------------------------------------
// Cloud-only workflow: pulls the `service_role` key for the linked Supabase
// project and writes `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` into
// `.env.local`. Every other key in the file is left untouched.
//
// Project reference is resolved, in order, from:
//   1. `--project-ref <ref>` argv flag
//   2. `SUPABASE_PROJECT_REF` env var
//   3. `supabase/.temp/project-ref` (written by `supabase link`)
//
// Prerequisites:
//   - `pnpm db:login` once (stores access token for the profile).
//   - `pnpm db:link` to bind this repo to the cloud project.
//
// Idempotent: safe to re-run. Preserves unmanaged env lines verbatim.
// =============================================================================

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const ENV_FILE = resolve(ROOT, '.env.local');
const EXAMPLE_FILE = resolve(ROOT, '.env.example');
const LINKED_REF_FILE = resolve(ROOT, 'supabase/.temp/project-ref');
const LOCAL_BIN = resolve(ROOT, 'node_modules/.bin/supabase');
const SUPABASE_BIN = existsSync(LOCAL_BIN) ? LOCAL_BIN : 'supabase';

function die(message) {
  console.error(`[sync-supabase-env] ${message}`);
  process.exit(1);
}

function resolveProjectRef() {
  const flagIndex = process.argv.indexOf('--project-ref');
  if (flagIndex !== -1 && process.argv[flagIndex + 1]) {
    return process.argv[flagIndex + 1];
  }
  if (process.env.SUPABASE_PROJECT_REF) {
    return process.env.SUPABASE_PROJECT_REF;
  }
  if (existsSync(LINKED_REF_FILE)) {
    return readFileSync(LINKED_REF_FILE, 'utf8').trim();
  }
  die(
    'No project ref found. Either run `pnpm db:link`, pass ' +
      '`--project-ref <ref>`, or export SUPABASE_PROJECT_REF.',
  );
}

function fetchServiceRoleKey(projectRef) {
  let raw;
  try {
    raw = execFileSync(
      SUPABASE_BIN,
      ['projects', 'api-keys', '--project-ref', projectRef, '-o', 'json'],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' },
    );
  } catch (err) {
    const msg = err?.stderr?.toString?.() ?? err?.message ?? String(err);
    die(
      'Failed to fetch API keys. Are you logged in? Try: pnpm db:login\n' +
        `  Details: ${msg.trim()}`,
    );
  }

  let keys;
  try {
    keys = JSON.parse(raw);
  } catch {
    die(`Could not parse CLI JSON output:\n${raw}`);
  }

  const serviceRole = keys.find(
    (k) => k.name === 'service_role' || k.tags === 'service_role',
  );
  if (!serviceRole?.api_key) {
    die('No service_role key returned by the API. Check project access.');
  }
  return serviceRole.api_key;
}

function upsertEnv(source, values) {
  const lines = source.split('\n');
  const seen = new Set();

  const next = lines.map((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=/);
    if (!match) return line;
    const key = match[1];
    if (!(key in values)) return line;
    seen.add(key);
    return `${key}=${quote(values[key])}`;
  });

  for (const key of Object.keys(values)) {
    if (!seen.has(key)) next.push(`${key}=${quote(values[key])}`);
  }
  return next.join('\n');
}

function quote(value) {
  const needsQuotes = /[\s"#=]/.test(value);
  if (!needsQuotes) return value;
  return `"${value.replace(/"/g, '\\"')}"`;
}

function main() {
  const projectRef = resolveProjectRef();
  const serviceRoleKey = fetchServiceRoleKey(projectRef);
  const url = `https://${projectRef}.supabase.co`;

  const values = {
    SUPABASE_URL: url,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
  };

  const seed = existsSync(ENV_FILE)
    ? readFileSync(ENV_FILE, 'utf8')
    : existsSync(EXAMPLE_FILE)
      ? readFileSync(EXAMPLE_FILE, 'utf8')
      : '';

  const next = upsertEnv(seed, values);
  writeFileSync(ENV_FILE, next.endsWith('\n') ? next : `${next}\n`);

  console.log(
    `[sync-supabase-env] Wrote credentials for project ${projectRef} → .env.local`,
  );
  console.log(`  · SUPABASE_URL                 = ${url}`);
  console.log(
    `  · SUPABASE_SERVICE_ROLE_KEY    = ${serviceRoleKey.slice(0, 12)}…`,
  );
}

main();
