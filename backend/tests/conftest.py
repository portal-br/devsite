from dataclasses import dataclass
from portalbrasil.devsite.testing import FUNCTIONAL_TESTING
from portalbrasil.devsite.testing import INTEGRATION_TESTING
from pytest_plone import fixtures_factory
from zope.component.hooks import site

import pytest


pytest_plugins = ["pytest_plone"]


FIXTURES = (
    (FUNCTIONAL_TESTING, "functional"),
    (INTEGRATION_TESTING, "integration"),
)


globals().update(fixtures_factory(FIXTURES))


@pytest.fixture
def distribution_name() -> str:
    """Distribution name."""
    return "devsite"


@dataclass
class CurrentVersions:
    profile: str
    package: str
    core_profile: str
    core_package: str


@pytest.fixture(scope="session")
def current_versions() -> CurrentVersions:
    from portalbrasil.devsite import __version__

    return CurrentVersions(
        profile="1000",
        package=__version__,
        core_profile="1000",
        core_package="1.0.0a0",
    )


@pytest.fixture(scope="class")
def portal_class(integration_class):
    if hasattr(integration_class, "testSetUp"):
        integration_class.testSetUp()
    portal = integration_class["portal"]
    with site(portal):
        yield portal
    if hasattr(integration_class, "testTearDown"):
        integration_class.testTearDown()
