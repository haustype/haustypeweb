#!/usr/bin/env node
/**
 * Seeds customEmbed on Orders and Trial Fonts CMS pages (only when empty).
 *
 * Run:
 *   SANITY_API_TOKEN=your-token node scripts/populate-page-embeds.mjs
 *
 * Or use CLI login:
 *   npx sanity exec scripts/populate-page-embeds.mjs --with-user-token
 */

import { createClient } from '@sanity/client';
import { getCliClient } from 'sanity/cli';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'b5rdpzo3';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';

const client = process.env.SANITY_API_TOKEN
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2025-01-28',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    })
  : getCliClient({ apiVersion: '2025-01-28' });

const PAGE_EMBEDS = {
  orders: '<fontdue-customer-login-form></fontdue-customer-login-form>',
  'trial-fonts': '<fontdue-test-fonts-form></fontdue-test-fonts-form>',
};

function fieldEmpty(value) {
  return value == null || (typeof value === 'string' && value.trim().length === 0);
}

async function patchIfEmpty(docId, embed) {
  const doc = await client.fetch(`*[_id == $id][0]{ customEmbed }`, { id: docId });
  if (!doc) {
    console.warn(`Page "${docId}" not found — skipped.`);
    return;
  }
  if (!fieldEmpty(doc.customEmbed)) {
    console.log(`"${docId}" already has customEmbed — skipped.`);
    return;
  }
  await client.patch(docId).set({ customEmbed: embed }).commit();
  console.log(`Set customEmbed on "${docId}".`);
}

async function main() {
  for (const [slug, embed] of Object.entries(PAGE_EMBEDS)) {
    const pages = await client.fetch(
      `*[_type == "page" && slug.current == $slug]{ _id, "isDraft": _id match "drafts.*" }`,
      { slug },
    );
    if (pages.length === 0) {
      console.warn(`No page with slug "${slug}" found.`);
      continue;
    }
    for (const page of pages) {
      await patchIfEmpty(page._id, embed);
    }
  }
  console.log('\nDone. Publish pages in Studio if needed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
