#!/usr/bin/env node
/**
 * Set homepage white-box padding to 40px (top/right/left) and 44px (bottom)
 * on every typeface homepageImages[].padding.
 *
 * Run:
 *   npx sanity exec scripts/migrate-homepage-box-padding.mjs --with-user-token
 *
 * Or:
 *   SANITY_API_TOKEN=your-token node scripts/migrate-homepage-box-padding.mjs
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

const WHITE_BOX_PADDING = {
  top: 40,
  right: 40,
  bottom: 44,
  left: 40,
};

async function main() {
  let imageCount = 0;

  const typefaces = await client.fetch(
    `*[_type == "typeface" && count(homepageImages) > 0]{ _id, homepageImages }`,
  );

  for (const typeface of typefaces) {
    const homepageImages = (typeface.homepageImages ?? []).map((entry) => ({
      ...entry,
      padding: WHITE_BOX_PADDING,
    }));

    await client.patch(typeface._id).set({ homepageImages }).commit();
    imageCount += typeface.homepageImages?.length ?? 0;
    console.log(`Updated ${typeface._id} (${typeface.homepageImages?.length ?? 0} image(s))`);
  }

  console.log(`\nDone. ${imageCount} homepage image padding(s) set to 40/40/44/40.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
