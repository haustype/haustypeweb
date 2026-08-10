#!/usr/bin/env node
/**
 * Set homepageSettings.aboutPadding to 32/32/36/32 (yellow about box).
 *
 * Run:
 *   npx sanity exec scripts/migrate-about-box-padding.mjs --with-user-token
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

const ABOUT_PADDING = {
  top: 32,
  right: 32,
  bottom: 36,
  left: 32,
};

async function main() {
  for (const id of ['homepageSettings', 'drafts.homepageSettings']) {
    const doc = await client.fetch(`*[_id == $id][0]{ _id }`, { id });
    if (!doc) continue;
    await client.patch(id).set({ aboutPadding: ABOUT_PADDING }).commit();
    console.log(`Updated ${id}.aboutPadding`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
