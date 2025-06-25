import { defineMessages } from 'react-intl';
import { addStyling } from '@plone/volto/helpers/Extensions/withBlockSchemaEnhancer';

const messages = defineMessages({
  BlockWidth: {
    id: 'Block Width',
    defaultMessage: 'Block Width',
  },
});

export const CodeStylingSchema = ({ schema, formData, intl }) => {
  addStyling({ schema, intl });

  schema.properties.styles.schema.fieldsets[0].fields = [
    'blockWidth:noprefix',
    ...schema.properties.styles.schema.fieldsets[0].fields,
  ];

  schema.properties.styles.schema.properties['blockWidth:noprefix'] = {
    widget: 'blockWidth',
    title: intl.formatMessage(messages.BlockWidth),
    default: 'default',
    filterActions: ['narrow', 'default'],
  };

  return schema;
};
