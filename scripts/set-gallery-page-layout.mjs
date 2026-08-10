/**
 * Set pageLayout to "gallery" for mosaic pages (fonts-in-use, commissions).
 *
 * Slugs must match GALLERY_PAGE_SLUGS in src/lib/gallery-pages.ts
 *
 * Run: sanity exec scripts/set-gallery-page-layout.mjs --with-user-token
 */
import { getCliClient } from 'sanity/cli';

const GALLERY_SLUGS = ['fonts-in-use', 'commissions'];

const client = getCliClient();

const pages = await client.fetch(
  `*[_type == "page" && slug.current in $slugs]{ _id, "slug": slug.current, pageLayout }`,
  { slugs: GALLERY_SLUGS },
);

if (!pages.length) {
  console.log('No matching pages found.');
  process.exit(0);
}

const tx = client.transaction();

for (const page of pages) {
  if (page.pageLayout === 'gallery') {
    console.log(`Skip ${page.slug} (already gallery)`);
    continue;
  }

  tx.patch(page._id, { set: { pageLayout: 'gallery' } });
  console.log(`Set ${page.slug} → gallery layout`);
}

await tx.commit();
console.log('Done.');
