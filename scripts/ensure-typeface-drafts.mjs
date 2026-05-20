#!/usr/bin/env node
/**
 * Ensures each typeface has a drafts.* document so Studio opens in editable mode.
 * Run: npx sanity exec scripts/ensure-typeface-drafts.mjs --with-user-token
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

const typefaces = await client.fetch(`*[_type == "typeface"]{ _id }`);

let created = 0;
for (const { _id } of typefaces) {
  const draftId = _id.startsWith('drafts.') ? _id : `drafts.${_id}`;
  const existing = await client.getDocument(draftId);
  if (existing) continue;

  const published = await client.getDocument(_id);
  if (!published) continue;

  const { _rev, _createdAt, _updatedAt, ...doc } = published;
  await client.createOrReplace({ ...doc, _id: draftId });
  console.log(`Created draft for ${published.name ?? _id}`);
  created += 1;
}

console.log(created ? `Done. ${created} draft(s) created.` : 'All typefaces already have drafts.');
