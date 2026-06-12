#!/usr/bin/env node
/**
 * One-time migration: ensure footerLinksSettings + footerContactSettings exist
 * and copy data from legacy footerSettings / siteSettings.
 *
 * Run:
 *   SANITY_API_TOKEN=your-token node scripts/migrate-footer-from-siteSettings.mjs
 *
 * Or use CLI login (no token env):
 *   npx sanity exec scripts/migrate-footer-from-siteSettings.mjs --with-user-token
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

const LINKS_ID = 'footerLinksSettings';
const CONTACT_ID = 'footerContactSettings';
const LEGACY_FOOTER_ID = 'footerSettings';
const SITE_ID = 'siteSettings';
const SITE_DRAFT_ID = `drafts.${SITE_ID}`;

const LEGACY_SITE_FIELDS = ['footerNavigation', 'instagramUrl', 'contactEmail'];

function hasMeaningfulValue(value) {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function fieldEmpty(value) {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
}

async function ensureDoc(id, type) {
  let doc = await client.fetch(`*[_id == $id][0]`, { id });
  if (!doc) {
    await client.create({ _id: id, _type: type });
    doc = {};
    console.log(`Created "${id}".`);
  }
  return doc;
}

async function syncDraft(id, type, content) {
  const draftId = `drafts.${id}`;
  const draftExists = await client.fetch(`count(*[_id == $draftId]) > 0`, { draftId });
  if (!draftExists) {
    await client.create({ _id: draftId, _type: type, ...content });
    console.log(`Created "${draftId}".`);
    return;
  }

  const draft = await client.fetch(`*[_id == $draftId][0]`, { draftId });
  const patch = {};
  for (const [key, value] of Object.entries(content)) {
    if (fieldEmpty(draft[key]) && hasMeaningfulValue(value)) {
      patch[key] = value;
    }
  }
  if (Object.keys(patch).length > 0) {
    await client.patch(draftId).set(patch).commit();
    console.log(`Synced "${draftId}":`, Object.keys(patch).join(', '));
  }
}

async function main() {
  const legacyFooter = await client.fetch(`*[_id == $id][0]`, { id: LEGACY_FOOTER_ID });
  const site = await client.fetch(`*[_id == $id][0]`, { id: SITE_ID });

  const linksDoc = await ensureDoc(LINKS_ID, 'footerLinksSettings');
  const contactDoc = await ensureDoc(CONTACT_ID, 'footerContactSettings');

  const patchLinks = {};
  if (fieldEmpty(linksDoc.links)) {
    if (hasMeaningfulValue(legacyFooter?.links)) patchLinks.links = legacyFooter.links;
    else if (hasMeaningfulValue(site?.footerNavigation)) patchLinks.links = site.footerNavigation;
  }

  const patchContact = {};
  if (fieldEmpty(contactDoc.instagramUrl)) {
    const url = legacyFooter?.instagramUrl ?? site?.instagramUrl;
    if (hasMeaningfulValue(url)) patchContact.instagramUrl = url;
  }
  if (fieldEmpty(contactDoc.contactEmail)) {
    const email = legacyFooter?.contactEmail ?? site?.contactEmail;
    if (hasMeaningfulValue(email)) patchContact.contactEmail = email;
  }
  if (fieldEmpty(contactDoc.contactLinks) && hasMeaningfulValue(legacyFooter?.contactLinks)) {
    patchContact.contactLinks = legacyFooter.contactLinks;
  }

  if (Object.keys(patchLinks).length > 0) {
    await client.patch(LINKS_ID).set(patchLinks).commit();
    console.log('Copied into footerLinksSettings:', Object.keys(patchLinks).join(', '));
  }

  if (Object.keys(patchContact).length > 0) {
    await client.patch(CONTACT_ID).set(patchContact).commit();
    console.log('Copied into footerContactSettings:', Object.keys(patchContact).join(', '));
  }

  const publishedLinks = await client.fetch(`*[_id == $id][0]`, { id: LINKS_ID });
  const publishedContact = await client.fetch(`*[_id == $id][0]`, { id: CONTACT_ID });
  await syncDraft(LINKS_ID, 'footerLinksSettings', { links: publishedLinks?.links });
  await syncDraft(CONTACT_ID, 'footerContactSettings', {
    instagramUrl: publishedContact?.instagramUrl,
    contactEmail: publishedContact?.contactEmail,
    contactLinks: publishedContact?.contactLinks,
  });

  const siteIds = [SITE_ID];
  const siteDraftExists = await client.fetch(`count(*[_id == $id]) > 0`, { id: SITE_DRAFT_ID });
  if (siteDraftExists) siteIds.push(SITE_DRAFT_ID);

  for (const id of siteIds) {
    await client.patch(id).unset(LEGACY_SITE_FIELDS).commit();
    console.log('Removed legacy paths from', id + ':', LEGACY_SITE_FIELDS.join(', '));
  }

  console.log('\nDone. Open Studio → Footer Settings → Links / Contact for edits.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
