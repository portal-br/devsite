import { useEffect, useState } from 'react';
import Image from '@plone/volto/components/theme/Image/Image';
import { useDispatch, useSelector } from 'react-redux';
import type { Content } from '@plone/types';
import {
  setSidebarTab,
  setMetadataFocus,
} from '@plone/volto/actions/sidebar/sidebar';
import isEmpty from 'lodash/isEmpty';
import { Container } from '@plone/components';

interface FormState {
  content: {
    data: Content;
  };
  form: {
    global: Content;
  };
}

export const LeadImageSlot = ({ content }: { content: Content }) => {
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formData = useSelector<FormState, Content>(
    (state) => state.form.global,
  );

  const data = isClient ? (isEmpty(formData) ? content : formData) : content;

  const imageField =
    data.image || data.preview_image_link || data.preview_image;

  return (
    <Container
      layout
      className="lead-image-slot"
      onClick={
        !isEmpty(formData)
          ? () => {
              dispatch(setSidebarTab(0));
              dispatch(setMetadataFocus('default', 'preview_image_link'));
            }
          : null
      }
    >
      {imageField ? (
        <Image
          item={imageField}
          imageField="image"
          alt={data.preview_caption_link || ''}
          responsive={true}
        />
      ) : null}
    </Container>
  );
};
