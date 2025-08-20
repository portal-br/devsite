import type { ConfigType } from '@plone/registry';
import { CodeStylingSchema } from '../components/Blocks/code/schema';
import ImageAlbum from '@portalbrasil/devsite/components/Blocks/Listing/ImageAlbum';

// We extend the Content type to include the new fields from the ICTA behavior
declare module '@plone/types' {
  export interface Content {
    preview_image_link: Content;
    preview_caption_link: string;
  }

  export interface BlocksConfigData {
    codeBlock: BlockConfigBase;
  }

  export interface WidgetsConfigByWidget {
    blockWidth: React.ComponentType;
  }
}

function installListingVariations(config: ConfigType) {
  config.blocks.blocksConfig.listing.variations = [
    ...config.blocks.blocksConfig.listing.variations,
    {
      id: 'imageAlbum',
      isDefault: false,
      title: 'Image Album',
      template: ImageAlbum,
    },
  ];
}

export default function install(config: ConfigType) {
  config.blocks.blocksConfig.leadimage.restricted = ({ properties }) =>
    !(
      properties.hasOwnProperty('image') ||
      properties.hasOwnProperty('preview_image') ||
      properties.hasOwnProperty('preview_image_link')
    );

  config.blocks.blocksConfig.codeBlock.defaultLanguage = 'python';
  config.blocks.blocksConfig.codeBlock.defaultStyle = 'dark';

  config.blocks.blocksConfig.codeBlock.schemaEnhancer = CodeStylingSchema;

  config.blocks.initialBlocks.BlogTag = [
    { '@type': 'title' },
    { '@type': 'description' },
    {
      '@type': 'listing',
      headline: 'Últimas postagens',
      headlineTag: 'h2',
      querystring: {
        query: [
          {
            i: 'blog_tags',
            o: 'plone.app.querystring.operation.currentUID',
            v: '',
          },
        ],
        sort_on: 'effective',
        sort_order: 'descending',
        sort_order_boolean: true,
      },
      styles: {},
      theme: 'default',
      variation: 'grid',
    },
  ];

  // Initial blocks for author content type
  config.blocks.initialBlocks.Author = [
    { '@type': 'title' },
    { '@type': 'description' },
    {
      '@type': 'listing',
      headline: 'Últimas postagens',
      headlineTag: 'h2',
      querystring: {
        query: [
          {
            i: 'Creator',
            o: 'plone.app.querystring.operation.currentUID',
            v: '',
          },
        ],
        sort_on: 'effective',
        sort_order: 'descending',
        sort_order_boolean: true,
      },
      styles: {},
      theme: 'default',
      variation: 'grid',
    },
  ];

  installListingVariations(config);

  return config;
}
