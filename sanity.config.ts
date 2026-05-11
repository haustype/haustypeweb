import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './src/sanity/schemaTypes';

/** Sanity CLI uses CJS for deploy/build; use env vars (see sanity.cli.js, .env). */
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? 'b5rdpzo3';
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Homepage Settings')
              .child(S.document().schemaType('homepageSettings').documentId('homepageSettings')),
            S.divider(),
            S.listItem().title('Blog Posts').child(S.documentTypeList('post').title('Blog Posts')),
            S.listItem().title('Pages').child(S.documentTypeList('page').title('Pages')),
            S.listItem().title('Typefaces').child(S.documentTypeList('typeface').title('Typefaces')),
          ]),
      defaultDocumentNode: (S, { schemaType }) => {
        const formOnlyTypes = ['siteSettings', 'homepageSettings'];
        if (formOnlyTypes.includes(schemaType)) {
          return S.document().views([S.view.form()]);
        }
        return S.document();
      },
    }),
  ],
  schema,
});
