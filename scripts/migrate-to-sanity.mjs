#!/usr/bin/env node
/**
 * Migrates existing site content into Sanity.
 *
 * Run with your logged-in Sanity CLI (no token needed):
 *   npx sanity exec scripts/migrate-to-sanity.mjs --with-user-token
 *
 * Or with an API token:
 *   SANITY_API_TOKEN=your-token node scripts/migrate-to-sanity.mjs
 *   (Create token at: https://sanity.io/manage → your project → API → Tokens)
 */

import { getCliClient } from 'sanity/cli';
import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

const client = process.env.SANITY_API_TOKEN
  ? createClient({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'b5rdpzo3',
      dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2025-01-28',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    })
  : getCliClient();

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

function markdownToPortableText(md) {
  if (!md || !md.trim()) return [];
  const blocks = [];
  const lines = md.split('\n');
  let currentBlock = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: 'block',
        _key: randomKey(),
        style: 'h2',
        children: [{ _type: 'span', _key: randomKey(), text: trimmed.slice(3) }],
        markDefs: [],
      };
    } else if (trimmed.startsWith('# ')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: 'block',
        _key: randomKey(),
        style: 'h1',
        children: [{ _type: 'span', _key: randomKey(), text: trimmed.slice(2) }],
        markDefs: [],
      };
    } else if (trimmed) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: 'block',
        _key: randomKey(),
        style: 'normal',
        children: [{ _type: 'span', _key: randomKey(), text: trimmed }],
        markDefs: [],
      };
    }
  }
  if (currentBlock) blocks.push(currentBlock);
  return blocks;
}

async function uploadImage(relativePath) {
  const path = join(publicDir, relativePath.replace(/^\//, ''));
  if (!existsSync(path)) return null;
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename: relativePath.split('/').pop(),
  });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

async function run() {
  // Client is set above: createClient with token, or getCliClient() for sanity exec

  console.log('Migrating content to Sanity...\n');

  // 1. Site Settings
  const heroImage = await uploadImage('hero.png');
  const fontsInUseImages = await Promise.all([
    uploadImage('fonts-in-use/illusions.png'),
    uploadImage('fonts-in-use/super-juicy.png'),
    uploadImage('fonts-in-use/mezcal.png'),
  ]);

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    aboutText: 'Haus Type is a type foundry situated in the heart of Valencia, Spain. For more than twenty years we have been creating retail and custom-made typefaces for global businesses.',
    heroItems: heroImage ? [{ _type: 'object', _key: randomKey(), type: 'image', image: heroImage, alt: 'Haus Type font display - Gemini, Grissom, Young' }] : [],
    fontsInUse: fontsInUseImages.filter(Boolean).map((img, i) => ({
      _type: 'object',
      _key: randomKey(),
      image: img,
      alt: ['Bruce Nauman Illusions exhibition on architectural facade', 'SUPER JUICY packaging', 'Mezcal de Oaxaca brochure'][i] || '',
    })),
  });
  console.log('✓ Site Settings');

  // 2. Typefaces
  const typefaces = [
    { name: 'Metrostile', category: 'Sans', styles: 1, slug: 'metrostile', image: 'typefaces/haus_19.png', collectionId: 'Rm9udENvbGxlY3Rpb246MTkzNzI0Mzc0MDk1NTc3NDcwMA==' },
    { name: 'Guglielmo Marconi*', category: 'Squoza', styles: 14, slug: 'guglielmo-marconi', image: 'typefaces/haus_07.png' },
    { name: 'Aerial Quango', category: 'Cimbric', styles: 0, slug: 'aerial-quango', image: 'typefaces/haus_10.png' },
    { name: 'SALS ICCIA', category: 'Salnicola', styles: 1, slug: 'salsiccia', image: 'typefaces/haus_13.png' },
    { name: 'Cinema Clubs', category: 'Metroitalic', styles: 0, slug: 'cinema-clubs', image: 'typefaces/haus_19.png' },
    { name: 'Puerto Vallarta', category: 'Chroniques', styles: 1, slug: 'puerto-vallarta', image: 'typefaces/haus_22.png' },
    { name: 'PSYCHE DELICA', category: 'Early', styles: 20, slug: 'psyche-delica', image: 'typefaces/haus_25.png' },
  ];

  for (let i = 0; i < typefaces.length; i++) {
    const tf = typefaces[i];
    const image = await uploadImage(tf.image);
    await client.createOrReplace({
      _id: `typeface-${tf.slug}`,
      _type: 'typeface',
      name: tf.name,
      slug: { _type: 'slug', current: tf.slug },
      category: tf.category,
      styles: tf.styles,
      order: i,
      image: image || undefined,
      collectionId: tf.collectionId || undefined,
    });
  }
  console.log('✓ Typefaces');

  // 3. Pages
  const pages = [
    { slug: 'information', title: 'Information', description: 'Contact and information about Haus Type.', order: 0, body: '## Contact\n\nHaus Type is a type foundry situated in the heart of Valencia, Spain.\n\nFor more than twenty years we have been creating retail and custom-made typefaces for global businesses.' },
    { slug: 'fonts', title: 'Fonts', description: 'Browse our typeface collection.', order: 1, body: '## Our Typefaces\n\nBrowse our collection of retail and custom typefaces. Font sales will be integrated with fontdue.js after deployment.' },
    { slug: 'in-use', title: 'In Use', description: 'See our fonts in client projects.', order: 2, body: '## Fonts In Use\n\nA showcase of our typefaces in real-world applications.' },
    { slug: 'projects', title: 'Projects', description: 'Custom type design projects.', order: 3, body: '## Projects\n\nOur custom type design and branding projects for clients worldwide.' },
    { slug: 'stuff', title: 'Stuff', description: 'Extras and resources.', order: 4, body: '## Stuff\n\nAdditional resources, tools, and type-related content.' },
  ];

  for (const p of pages) {
    await client.createOrReplace({
      _id: `page-${p.slug}`,
      _type: 'page',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      description: p.description,
      order: p.order,
      body: markdownToPortableText(p.body),
    });
  }
  console.log('✓ Pages');

  // 4. Blog post
  const postBody = `This is a placeholder blog post. Edit or delete it via the CMS, then create your own content.

Haus Type creates retail and custom typefaces for global businesses from our studio in Valencia, Spain.`;

  await client.createOrReplace({
    _id: 'post-placeholder',
    _type: 'post',
    title: 'Welcome to Haus Type',
    slug: { _type: 'slug', current: 'placeholder' },
    description: 'Introducing our type foundry and what we do.',
    publishedAt: '2025-02-24T00:00:00.000Z',
    author: 'Haus Type',
    draft: false,
    body: markdownToPortableText(postBody),
  });
  console.log('✓ Blog post');

  console.log('\nMigration complete! Refresh your Studio at http://localhost:3333');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
