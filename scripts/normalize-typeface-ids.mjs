#!/usr/bin/env node
/**
 * Re-keys typeface documents so _id matches slug: typeface-{slug}.
 * Sanity Studio URLs use _id, not slug — old migrate IDs (e.g. typeface-psyche-delica) persist until fixed.
 *
 * Run: npx sanity exec scripts/normalize-typeface-ids.mjs --with-user-token
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

const typefaces = await client.fetch(
  `*[_type == "typeface"]{ _id, name, "slug": slug.current }`,
);

let moved = 0;
let skipped = 0;

for (const doc of typefaces) {
  const slug = doc.slug?.trim();
  if (!slug) {
    console.log(`⊘ Skip ${doc._id} (${doc.name}) — no slug set`);
    skipped += 1;
    continue;
  }

  const targetId = `typeface-${slug}`;
  if (doc._id === targetId) {
    continue;
  }

  const existing = await client.getDocument(targetId);
  if (existing) {
    console.warn(`⚠ Skip ${doc._id} → ${targetId}: target already exists (${existing.name})`);
    skipped += 1;
    continue;
  }

  const published = await client.getDocument(doc._id);
  if (!published) continue;

  const { _rev, _createdAt, _updatedAt, ...payload } = published;
  await client.createOrReplace({ ...payload, _id: targetId });

  const draftId = doc._id.startsWith('drafts.') ? doc._id : `drafts.${doc._id}`;
  const targetDraftId = `drafts.${targetId}`;
  const draft = await client.getDocument(draftId);
  if (draft) {
    const { _rev: dRev, _createdAt: dCreated, _updatedAt: dUpdated, ...draftPayload } = draft;
    await client.createOrReplace({ ...draftPayload, _id: targetDraftId });
    await client.delete(draftId);
  }

  await client.delete(doc._id);
  console.log(`✓ ${doc._id} (${doc.name}) → ${targetId}`);
  moved += 1;
}

console.log(moved ? `\nDone. ${moved} document(s) re-keyed.` : '\nAll typeface IDs already match slugs.');
if (skipped) console.log(`${skipped} skipped (set missing slugs in Studio, then re-run).`);
