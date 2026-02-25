import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './src/sanity/schemaTypes';

const projectId = import.meta.env?.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? 'b5rdpzo3';
const dataset = import.meta.env?.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Site Settings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem().title('Blog Posts').child(S.documentTypeList('post').title('Blog Posts')),
            S.listItem().title('Pages').child(S.documentTypeList('page').title('Pages')),
            S.listItem().title('Typefaces').child(S.documentTypeList('typeface').title('Typefaces')),
          ]),
    }),
  ],
  schema,
});
