#!/usr/bin/env node
/**
 * Creates a Sanity webhook that triggers Netlify rebuilds when content is published.
 *
 * Option A – You provide the Netlify build hook URL:
 *   NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/xxx node scripts/setup-sanity-webhook.mjs
 *
 * Option B – Script creates the build hook (requires Netlify token):
 *   NETLIFY_ACCESS_TOKEN=xxx node scripts/setup-sanity-webhook.mjs
 *
 * Sanity token (required for creating the webhook):
 *   SANITY_API_TOKEN=xxx  (create at sanity.io/manage → API → Tokens)
 *   Or run via: npx sanity exec scripts/setup-sanity-webhook.mjs --with-user-token
 *   (then use getCliClient for the token - but the webhook API needs a different token)
 *
 * Actually the Sanity Management API requires a token. Let me use fetch with the token.
 */

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'b5rdpzo3';
const dataset = 'production';
const sanityToken = process.env.SANITY_API_TOKEN;
let buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;

async function createNetlifyBuildHook() {
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  if (!token) return null;

  const res = await fetch('https://api.netlify.com/api/v1/sites', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Netlify API error: ${res.status}`);
  const sites = await res.json();
  const site = sites.find((s) => s.name?.includes('haustype') || s.url?.includes('haustypeweb'));
  if (!site) throw new Error('Could not find haustypeweb site in Netlify');

  const hookRes = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/build_hooks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: 'Sanity content update', branch: 'main' }),
  });
  if (!hookRes.ok) throw new Error(`Netlify build hook error: ${hookRes.status}`);
  const hook = await hookRes.json();
  return hook.url;
}

async function createSanityWebhook(url) {
  if (!sanityToken) throw new Error('Set SANITY_API_TOKEN (create at sanity.io/manage → API → Tokens)');

  const body = {
    type: 'transaction',
    name: 'Netlify rebuild on publish',
    url,
    dataset,
    description: 'Triggers Netlify deploy when content is published',
  };

  const res = await fetch(
    `https://api.sanity.io/v2021-10-04/hooks/projects/${projectId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sanityToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sanity webhook error ${res.status}: ${err}`);
  }
  return res.json();
}

async function main() {
  console.log('Setting up Sanity → Netlify webhook...\n');

  if (!buildHookUrl && process.env.NETLIFY_ACCESS_TOKEN) {
    console.log('Creating Netlify build hook...');
    buildHookUrl = await createNetlifyBuildHook();
    console.log('✓ Build hook created:', buildHookUrl);
  }

  if (!buildHookUrl) {
    console.error('Need either:');
    console.error('  1. NETLIFY_BUILD_HOOK_URL - Create at app.netlify.com → Site → Build & deploy → Build hooks');
    console.error('  2. NETLIFY_ACCESS_TOKEN - To create the hook automatically');
    process.exit(1);
  }

  const webhook = await createSanityWebhook(buildHookUrl);
  console.log('✓ Sanity webhook created:', webhook.name);
  console.log('\nPublishing content in Sanity will now trigger Netlify rebuilds.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
