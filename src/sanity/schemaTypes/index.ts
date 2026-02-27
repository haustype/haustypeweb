import type { SchemaTypeDefinition } from 'sanity';
import { blockContentType } from './blockContent';
import { homepageSettingsType } from './homepageSettings';
import { pagePageSectionType } from './pagePageSection';
import { pageType } from './page';
import { postType } from './post';
import { siteSettingsType } from './siteSettings';
import { typefacePageSectionType } from './typefacePageSection';
import { typefaceType } from './typeface';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, homepageSettingsType, pagePageSectionType, postType, pageType, typefacePageSectionType, typefaceType, siteSettingsType],
};
