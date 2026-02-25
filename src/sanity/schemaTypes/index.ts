import type { SchemaTypeDefinition } from 'sanity';
import { blockContentType } from './blockContent';
import { pageType } from './page';
import { postType } from './post';
import { siteSettingsType } from './siteSettings';
import { typefaceType } from './typeface';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, postType, pageType, typefaceType, siteSettingsType],
};
