from plone import api
from plone.namedfile.file import NamedBlobImage
from portalbrasil.devsite import logger
from Products.CMFPlone.Portal import PloneSite
from typing import Any
from uuid import uuid4

import codecs


def update_registry(data: dict[str, Any]) -> None:
    """Update Plone registry with provided data."""
    for key, value in data.items():
        api.portal.set_registry_record(key, value)
        logger.info(f"Atualizado a entrada do registro: {key}")


def convert_data_uri_to_image(raw_data: str) -> NamedBlobImage:
    """Convert data-uri format to a NamedBlobImage."""
    headers, body = raw_data.split("base64,")
    filename: str = headers.split("name=")[1][:-1]
    data = codecs.decode(body.encode("utf-8"), "base64")
    return NamedBlobImage(data=data, filename=filename)


def set_site_logo(raw_logo: str, portal: PloneSite) -> None:
    """Create an Image object from a data URI and set it as the site logo."""
    image = convert_data_uri_to_image(raw_logo)
    portal.logo = image
    logger.info(f"Definido logo para {portal.id} com dados fornecidos via formulário.")


def set_social_links(social_links: list[dict[str, str]], portal: PloneSite) -> None:
    portal.social_links = social_links
    logger.info(
        f"Definidos links sociais para {portal.id} com dados fornecidos via formulário."
    )


def parse_social_links(links: list[dict[str, str]]) -> list[dict[str, str]]:
    """Parse social links from the provided list."""
    parsed_links = []
    for link in links:
        id_ = link.get("id", "")
        title = link.get("title", id_)
        href = link.get("href", "")
        if id_ and href:
            uid = str(uuid4())
            item = {
                "@id": uid,
                "id": id_,
                "title": title,
                "href": [{"@id": href, "title": title}],
            }
            parsed_links.append(item)
    return parsed_links
