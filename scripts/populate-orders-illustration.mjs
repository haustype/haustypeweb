#!/usr/bin/env node
/**
 * Uploads public/images/hauser.png to the Orders page CMS field (only when empty).
 *
 * Run: npm run populate:orders-illustration
 */

import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { getCliClient } from 'sanity/cli';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const imagePath = path.join(projectRoot, 'public/images/hauser.png');

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

async function main() {
  try {
    await access(imagePath);
  } catch {
    console.error(`Missing ${imagePath} — add the PNG first, then re-run.`);
    process.exit(1);
  }

  const page = await client.fetch(
    `*[_type == "page" && slug.current == "orders" && !(_id in path("drafts.**"))][0]{
      _id,
      ordersIllustration
    }`,
  );

  if (!page) {
    console.warn('Orders page not found in Sanity — skipped.');
    process.exit(0);
  }

  if (page.ordersIllustration?.asset?._ref) {
    console.log('Orders page already has an illustration — skipped.');
    process.exit(0);
  }

  const asset = await client.assets.upload('image', createReadStream(imagePath), {
    filename: 'hauser.png',
    contentType: 'image/png',
  });

  await client
    .patch(page._id)
    .set({
      ordersIllustration: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: '',
      },
    })
    .commit();

  console.log('Uploaded hauser.png to Orders → Orders illustration.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
