import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SIDEBAR_MIN_WIDTH = 240;
const chunksDir = join(dirname(fileURLToPath(import.meta.url)), '../node_modules/sanity/lib/_chunks-es');

const patches = [
  {
    file: join(chunksDir, 'index3.js'),
    from: '"data-ui": "ListPane", id: paneKey, maxWidth: 640, minWidth: 320',
    to: `"data-ui": "ListPane", id: paneKey, maxWidth: 640, minWidth: ${SIDEBAR_MIN_WIDTH}`,
  },
  {
    file: join(chunksDir, 'pane.js'),
    from: '"data-ui": "DocumentListPane", id: paneKey, minWidth: 320',
    to: `"data-ui": "DocumentListPane", id: paneKey, minWidth: ${SIDEBAR_MIN_WIDTH}`,
  },
];

for (const { file, from, to } of patches) {
  let content = readFileSync(file, 'utf8');

  if (content.includes(to)) {
    continue;
  }

  if (!content.includes(from)) {
    console.warn(`[patch-sanity-sidebar-min-width] Skipped ${file}: expected string not found`);
    continue;
  }

  content = content.replace(from, to);
  writeFileSync(file, content);
  console.log(`[patch-sanity-sidebar-min-width] Patched ${file}`);
}
