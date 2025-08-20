import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { Button, Modal } from 'semantic-ui-react';
import { Container } from '@plone/components';
import type { ContainedItem } from '@plone/types';
import zoomSVG from '@plone/volto/icons/zoom-in.svg';
import config from '@plone/volto/registry';

const messages = defineMessages({
  zoomAction: {
    id: 'Zoom',
    defaultMessage: 'Zoom',
  },
});

const AlbumItem = ({ item }: { item: ContainedItem }) => {
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);
  const baseURL = flattenToAppURL(item['@id']);
  const imageField = item.image_field || 'image';
  const image = item.image_scales?.[imageField]?.[0] || {};
  const scales = image.scales || {};
  const originalImage = `${baseURL}/${image?.download}`;
  const previewImage = `${baseURL}/${scales?.preview?.download}`;
  const acao = intl.formatMessage(messages.zoomAction);
  return (
    image && (
      <div className="album-item">
        <div className="album-item-image">
          <img src={previewImage} alt={item.title} />
        </div>
        <div className="album-item-info">
          <Modal
            className="modal-image-full"
            closeIcon
            size="fullscreen"
            trigger={
              <Button
                className="zoom btn-open"
                title={acao}
                onClick={(evt) => evt.preventDefault()}
              >
                <Icon name={zoomSVG} className={'zoom icon'} />
                <span className="zoom text">{acao}</span>
              </Button>
            }
            onClose={() => setModalOpen(false)}
            onOpen={() => setModalOpen(true)}
            open={modalOpen}
          >
            <Modal.Content image className="album-modal">
              <Container className="album-modal-image">
                <img
                  src={originalImage}
                  alt={item.title}
                  className="modal-image"
                />
              </Container>
              <Container className="album-modal-footer">
                <span>{item.title}</span>
                <span>{item.description}</span>
              </Container>
            </Modal.Content>
          </Modal>
        </div>
      </div>
    )
  );
};

const ImageAlbum = ({ items }: { items: ContainedItem[] }) => {
  const { settings } = config;
  const renderItems = items.filter(
    (content) =>
      settings.imageObjects.includes(content['@type']) && content.image_field,
  );

  return (
    renderItems.length > 0 && (
      <>
        <Container className={'album-items'}>
          {renderItems.length > 0 &&
            renderItems.map((item) => (
              <AlbumItem key={item['@id']} item={item} />
            ))}
        </Container>
      </>
    )
  );
};

export default ImageAlbum;
