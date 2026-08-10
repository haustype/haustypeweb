import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { defineConfig, type NumberInputProps } from 'sanity';
import { structureTool } from 'sanity/structure';
import { ArrowStepNumberInput } from './src/sanity/components/ArrowStepNumberInput';
import { schema } from './src/sanity/schemaTypes';
import './src/sanity/studio.css';

/** Sanity CLI uses CJS for deploy/build; use env vars (see sanity.cli.js, .env). */
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? 'b5rdpzo3';
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  projectId,
  dataset,
  /** Avoid Content Releases UI locking documents in read-only published-only mode by default */
  releases: {
    enabled: false,
  },
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Homepage Settings')
              .child(S.document().schemaType('homepageSettings').documentId('homepageSettings')),
            S.listItem()
              .title('Footer Settings')
              .child(
                S.list()
                  .title('Footer Settings')
                  .items([
                    S.listItem()
                      .title('Links')
                      .child(
                        S.document()
                          .schemaType('footerLinksSettings')
                          .documentId('footerLinksSettings'),
                      ),
                    S.listItem()
                      .title('Contact')
                      .child(
                        S.document()
                          .schemaType('footerContactSettings')
                          .documentId('footerContactSettings'),
                      ),
                  ]),
              ),
            S.divider(),
            S.listItem().title('Blog Posts').child(S.documentTypeList('post').title('Blog Posts')),
            orderableDocumentListDeskItem({ type: 'page', title: 'Pages', S, context }),
            orderableDocumentListDeskItem({ type: 'typeface', title: 'Typefaces', S, context }),
          ]),
      defaultDocumentNode: (S, { schemaType }) => {
        const formOnlyTypes = ['siteSettings', 'homepageSettings', 'footerLinksSettings', 'footerContactSettings'];
        if (formOnlyTypes.includes(schemaType)) {
          return S.document().views([S.view.form()]);
        }
        return S.document();
      },
    }),
  ],
  schema,
  form: {
    components: {
      input: (props) => {
        if (props.schemaType.name === 'number') {
          return ArrowStepNumberInput(props as NumberInputProps);
        }
        return props.renderDefault(props);
      },
    },
  },
});
