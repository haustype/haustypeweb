#!/usr/bin/env node
/**
 * Creates/updates the Privacy policy CMS page and adds it under Footer Info.
 *
 * Run:
 *   npx sanity exec scripts/ensure-privacy-page.mjs --with-user-token
 */

import { randomBytes } from 'node:crypto';
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

function key() {
  return randomBytes(6).toString('hex');
}

function block(text, style = 'normal') {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), marks: [], text }],
  };
}

function blockWithMarks(parts) {
  const markDefs = [];
  const children = parts.map((part) => {
    const marks = [];
    if (part.href || part.email) {
      const markKey = key();
      if (part.email) {
        markDefs.push({
          _type: 'link',
          _key: markKey,
          linkType: 'email',
          email: part.email,
        });
      } else {
        markDefs.push({
          _type: 'link',
          _key: markKey,
          linkType: 'url',
          href: part.href,
          openInNewTab: part.newTab ? 'new' : 'same',
        });
      }
      marks.push(markKey);
    }
    if (part.strong) marks.push('strong');
    return { _type: 'span', _key: key(), marks, text: part.text };
  });
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs,
    children,
  };
}

function listItem(text, listItem = 'bullet') {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem,
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), marks: [], text }],
  };
}

function privacyBody() {
  return [
    block(
      'This policy explains how Haus Type (“we”) handles information when you use www.haustype.com and related checkout services. It is written for clarity; it is not formal legal advice.',
    ),
    block('Who we are', 'h2'),
    blockWithMarks([
      { text: 'Haus Type is an independent type foundry. For privacy questions, contact ' },
      { text: 'abc@haustype.com', email: 'abc@haustype.com' },
      { text: '.' },
    ]),
    block('What this site uses', 'h2'),
    block('Necessary site functions', 'h3'),
    block(
      'We use storage that is needed for the site to work as you expect — for example remembering your background colour preference, cart/checkout state via Fontdue and Stripe, and login for downloading purchases. These are not used for advertising analytics.',
    ),
    block('Google Analytics (optional)', 'h3'),
    blockWithMarks([
      {
        text: 'If you accept cookies, we load Google Analytics 4 to understand aggregate traffic (pages viewed, approximate location, device type, and similar). Google may process this data on our behalf. Analytics cookies are only set after you click ',
      },
      { text: 'Accept', strong: true },
      { text: ' on the cookie banner. You can choose ' },
      { text: 'Reject', strong: true },
      { text: ' and still use the site; we will not load Analytics.' },
    ]),
    blockWithMarks([
      { text: 'Google’s information: ' },
      {
        text: 'policies.google.com/privacy',
        href: 'https://policies.google.com/privacy',
        newTab: true,
      },
      { text: '.' },
    ]),
    block('Font sales & accounts (Fontdue / Stripe)', 'h3'),
    block(
      'When you buy fonts, download trials, or manage orders, checkout and account features are provided by Fontdue and payment by Stripe. They process the data needed to complete purchases (such as email, billing details, and order history) under their own terms and privacy policies.',
    ),
    block('Your choices', 'h2'),
    listItem('Accept or reject Analytics cookies via the banner on first visit.'),
    listItem('Clear site data in your browser to reset that choice (the banner will appear again).'),
    listItem('Email us if you have questions about your data.'),
    block('How long we keep data', 'h2'),
    block(
      'Analytics retention follows our Google Analytics settings. Order and account records are kept as needed for purchases, support, and legal obligations.',
    ),
    block('Changes', 'h2'),
    block(
      'We may update this page from time to time. The date below will change when we do.',
    ),
    block('Last updated: 26 October 2026'),
  ];
}

async function ensurePrivacyPage() {
  const existing = await client.fetch(
    `*[_type == "page" && slug.current == "privacy" && !(_id in path("drafts.**"))][0]{ _id }`,
  );

  const doc = {
    _type: 'page',
    title: 'Privacy policy',
    slug: { _type: 'slug', current: 'privacy' },
    description:
      'How Haus Type uses cookies and personal data on haustype.com, including Google Analytics and checkout.',
    pageLayout: 'standard',
    contentSegments: [
      {
        _type: 'contentSegment',
        _key: key(),
        layout: 'split',
        heading: 'Privacy policy',
        body: privacyBody(),
      },
    ],
  };

  if (existing?._id) {
    await client.patch(existing._id).set(doc).commit();
    console.log('Updated Privacy policy page:', existing._id);
    return existing._id;
  }

  const created = await client.create(doc);
  console.log('Created Privacy policy page:', created._id);
  return created._id;
}

async function ensureFooterLink(pageId) {
  const footer = await client.fetch(
    `*[_type == "footerLinksSettings" && !(_id in path("drafts.**"))][0]{
      _id,
      links[]{ _key, _type, page->{ _id, "slug": slug.current } }
    }`,
  );

  if (!footer?._id) {
    console.warn('footerLinksSettings not found — add Privacy under Footer Info in Studio.');
    return;
  }

  const already = (footer.links ?? []).some(
    (link) => link._type === 'internalLink' && link.page?.slug === 'privacy',
  );
  if (already) {
    console.log('Footer Info already links to Privacy — skipped.');
    return;
  }

  const nextLinks = [
    ...(footer.links ?? []).map((link) => ({
      _key: link._key,
      _type: link._type,
      ...(link._type === 'internalLink' && link.page?._id
        ? { page: { _type: 'reference', _ref: link.page._id } }
        : {}),
    })),
    {
      _key: key(),
      _type: 'internalLink',
      page: { _type: 'reference', _ref: pageId },
    },
  ];

  // Re-fetch raw links so we don't drop non-internal items
  const raw = await client.fetch(
    `*[_id == $id][0].links`,
    { id: footer._id },
  );

  const hasPrivacyRef = (raw ?? []).some(
    (link) => link._type === 'internalLink' && link.page?._ref === pageId,
  );
  if (hasPrivacyRef) {
    console.log('Footer Info already references Privacy — skipped.');
    return;
  }

  await client
    .patch(footer._id)
    .set({
      links: [
        ...(raw ?? []),
        {
          _key: key(),
          _type: 'internalLink',
          page: { _type: 'reference', _ref: pageId },
        },
      ],
    })
    .commit();

  // Keep draft in sync if present
  try {
    await client
      .patch(`drafts.${footer._id}`)
      .setIfMissing({ links: [] })
      .insert('after', 'links[-1]', [
        {
          _key: key(),
          _type: 'internalLink',
          page: { _type: 'reference', _ref: pageId },
        },
      ])
      .commit();
  } catch {
    // no draft — fine
  }

  console.log('Added Privacy to Footer Info.');
  void nextLinks;
}

async function main() {
  const pageId = await ensurePrivacyPage();
  await ensureFooterLink(pageId);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
