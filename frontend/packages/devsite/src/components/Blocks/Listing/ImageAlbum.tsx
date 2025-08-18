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

const CarouselItem = ({ item }: { item: ContainedItem }) => {
  const baseURL = flattenToAppURL(item['@id']);
  const imageField = item.image_field || 'image';
  const image = item.image_scales?.[imageField]?.[0] || {};
  const scales = image.scales || {};
  const previewImage = `${baseURL}/${scales?.large?.download}`;
  return <img src={previewImage} alt={item.title} loading="lazy" />;
};

const ImageAlbum = ({ items }: { items: ContainedItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = config;
  const renderItems = items.filter(
    (content) =>
      settings.imageObjects.includes(content['@type']) && content.image_field,
  );

  function openDialog(index) {
    console.log(index);
    if (!document.startViewTransition) {
      setIsOpen(true);
      document.querySelectorAll('#carousel img')[index].scrollIntoView();
    } else handleTransition(index);
  }

  // Wait until the transition finished and the dialog opens before scrolling into view.
  async function handleTransition(index) {
    const transition = document.startViewTransition(() => setIsOpen(true));
    try {
      await transition.finished;
    } finally {
      document.querySelectorAll('#carousel img')[index].scrollIntoView();
    }
  }

  const closeDialog = () => {
    if (!document.startViewTransition) setIsOpen(false);
    else document.startViewTransition(() => setIsOpen(false));
  };

  return (
    renderItems.length > 0 && (
      <>
        <Container className={'album-items'}>
          {renderItems.length > 0 &&
            renderItems.map((item) => (
              <AlbumItem key={item['@id']} item={item} />
            ))}
        </Container>

        {isOpen && (
          <dialog className="dialog" id="dialog">
            <div className="dialogContainer">
              <div className="carousel" id="carousel">
                {renderItems.length > 0 &&
                  renderItems.map((item, index) => (
                    <picture onClick={() => openDialog(index)}>
                      <CarouselItem key={item['@id']} item={item} />
                    </picture>
                  ))}
              </div>
            </div>
            <div className="controls">
              <button className="controls-btn preview">
                <i className="ri-arrow-left-circle-fill"></i>
              </button>
              <button className="controls-btn next">
                <i className="ri-arrow-right-circle-fill"></i>
              </button>
            </div>
            <button
              onClick={closeDialog}
              id="closeDialogBtn"
              className="closeDialog"
            >
              <i className="ri-close-line"></i>
            </button>
          </dialog>
        )}
      </>
    )
  );
};

export default ImageAlbum;
