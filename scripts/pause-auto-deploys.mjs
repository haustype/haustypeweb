#!/usr/bin/env node
/**
 * Pauses automatic deploys by disabling the Sanity → Netlify webhook.
 *
 * Run with:
 *   SANITY_API_TOKEN=xxx node scripts/pause-auto-deploys.mjs
 *
 * (Create token at sanity.io/manage → API → Tokens)
 *
 * To re-enable later, run: node scripts/setup-sanity-webhook.mjs
 * (You may need to delete the disabled webhook in Sanity first, then re-create.)
 */

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'b5rdpzo3';
const sanityToken = process.env.SANITY_API_TOKEN;

async function listWebhooks() {
  const res = await fetch(
    `https://api.sanity.io/v2021-10-04/hooks/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${sanityToken}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Sanity API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.result || [];
}

async function disableWebhook(id) {
  const res = await fetch(
    `https://api.sanity.io/v2021-10-04/hooks/projects/${projectId}/${id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sanityToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isDisabledByUser: true }),
    }
  );
  if (!res.ok) throw new Error(`Sanity API error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  if (!sanityToken) {
    console.error('Set SANITY_API_TOKEN (create at sanity.io/manage → API → Tokens)');
    process.exit(1);
  }

  console.log('Pausing automatic deploys...\n');

  const webhooks = await listWebhooks();
  const netlifyHook = webhooks.find(
    (w) =>
      w.name?.toLowerCase().includes('netlify') ||
      w.url?.includes('netlify.com')
  );

  if (!netlifyHook) {
    console.log('No Sanity → Netlify webhook found. Automatic deploys are already paused.');
    return;
  }

  await disableWebhook(netlifyHook.id);
  console.log('✓ Disabled webhook:', netlifyHook.name);
  console.log('\nPublishing in Sanity will no longer trigger Netlify deploys.');
  console.log('\nTo re-enable: Delete this webhook in Sanity (sanity.io/manage → API → Webhooks),');
  console.log('then run: NETLIFY_BUILD_HOOK_URL=... SANITY_API_TOKEN=... node scripts/setup-sanity-webhook.mjs');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
