from plone.distribution.core import Distribution
from plone.distribution.handler import default_handler
from plone.distribution.utils.data import convert_data_uri_to_b64
from portalbrasil.devsite import logger
from portalbrasil.devsite.utils import site_creation as utils
from Products.CMFPlone.Portal import PloneSite


def pre_handler(answers: dict) -> dict:
    """Process answers."""
    answers["social_links"] = utils.parse_social_links(answers.get("social_links", []))
    available_languages = answers.get("available_languages", ["pt-br"])
    answers["default_language"] = available_languages[0]
    return answers


def handler(distribution: Distribution, site: PloneSite, answers: dict) -> PloneSite:
    """Handler to create a new site."""
    site = default_handler(distribution, site, answers)
    return site


def post_handler(
    distribution: Distribution, site: PloneSite, answers: dict
) -> PloneSite:
    """Run after site creation."""
    name = distribution.name
    logger.info(f"{site.id}: Running {name} post_handler")
    # This should be fixed on plone.distribution
    title = answers.get("title", site.title)
    description = answers.get("description", site.description)
    social_links = answers.get("social_links")
    registry_data = {
        "plone.available_languages": answers["available_languages"],
        "plone.default_language": answers["default_language"],
        "plone.email_from_name": title,
        "plone.site_title": title,
    }

    raw_logo = answers.get("site_logo")
    if raw_logo:
        logo = convert_data_uri_to_b64(raw_logo)
        registry_data["plone.site_logo"] = logo
        utils.set_site_logo(raw_logo, site)

    # Update registry
    utils.update_registry(registry_data)

    site.title = title
    site.description = description
    if social_links:
        utils.set_social_links(social_links, site)
    return site
