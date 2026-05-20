#!/usr/bin/env node
/**
 * Converts legacy cardImages (bare image objects) to cardImageItem { image, alt }.
 *
 * Run:
 *   npx sanity exec scripts/migrate-card-images.mjs --with-user-token
 */

import { createClient } from '@sanity/client';
import { getCliClient } from 'sanity/cli';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? 'b5rdpzo3';
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';

const client = process.env.SANITY_API_TOKEN
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2025-01-28',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    })
  : getCliClient({ apiVersion: '2025-01-28' });

function migrateCardImages(cardImages) {
  if (!cardImages?.length) return cardImages;

  return cardImages.map((item) => {
    if (item._type === 'cardImageItem' && item.image?.asset) return item;
    if (item.asset) {
      return {
        _type: 'cardImageItem',
        _key: item._key,
        alt: item.alt ?? '',
        image: {
          _type: 'image',
          asset: item.asset,
        },
      };
    }
    return item;
  });
}

const docs = await client.fetch(`*[_type == "typeface" && defined(cardImages) && count(cardImages) > 0]{
  _id,
  cardImages
}`);

if (!docs.length) {
  console.log('No typefaces with cardImages to migrate.');
  process.exit(0);
}

let updated = 0;
for (const doc of docs) {
  const next = migrateCardImages(doc.cardImages);
  const changed = JSON.stringify(next) !== JSON.stringify(doc.cardImages);
  if (!changed) continue;

  await client.patch(doc._id).set({ cardImages: next }).commit();
  console.log(`Migrated cardImages on ${doc._id}`);
  updated += 1;
}

console.log(`Done. Updated ${updated} document(s).`);
