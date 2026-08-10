import type { SchemaTypeDefinition } from 'sanity';
import { blockContentType } from './blockContent';
import { contentSegmentType } from './contentSegment';
import { homepageSettingsType } from './homepageSettings';
import { inUseGalleryItemType } from './inUseGalleryItem';
import { pagePageSectionType } from './pagePageSection';
import { pageType } from './page';
import { postType } from './post';
import { footerContactSettingsType } from './footerContactSettings';
import { footerLinksSettingsType } from './footerLinksSettings';
import { siteSettingsType } from './siteSettings';
import { typefaceHomepageImageType } from './typefaceHomepageImage';
import { boxPaddingType } from './boxPadding';
import { homepageTileOrderType } from './homepageTileOrder';
import { typefacePageSectionType } from './typefacePageSection';
import { typefaceType } from './typeface';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, boxPaddingType, contentSegmentType, footerContactSettingsType, footerLinksSettingsType, homepageSettingsType, homepageTileOrderType, inUseGalleryItemType, pagePageSectionType, postType, pageType, typefaceHomepageImageType, typefacePageSectionType, typefaceType, siteSettingsType],
};
