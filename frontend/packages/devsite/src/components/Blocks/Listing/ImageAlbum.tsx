import React, { useState } from 'react';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { Container } from '@plone/components';
import type { ContainedItem } from '@plone/types';
import config from '@plone/volto/registry';

const AlbumItem = ({ item }: { item: ContainedItem }) => {
  const baseURL = flattenToAppURL(item['@id']);
  const imageField = item.image_field || 'image';
  const image = item.image_scales?.[imageField]?.[0] || {};
  const scales = image.scales || {};
  // const originalImage = `${baseURL}/@@images/${image?.download}`;
  const previewImage = `${baseURL}/${scales?.preview?.download}`;
  return (
    image && (
      <div className="album-item">
        <div className="album-item-image">
          <img src={previewImage} alt={item.title} />
        </div>
        <div className="album-item-info">
          <p className="album-item-title">{item.title}</p>
          <p className="album-item-description">{item.description}</p>
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
