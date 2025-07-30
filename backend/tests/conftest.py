from dataclasses import dataclass
from plone import api
from portalbrasil.devsite.testing import FUNCTIONAL_TESTING
from portalbrasil.devsite.testing import INTEGRATION_TESTING
from pytest_plone import fixtures_factory
from typing import Any
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
        core_package="1.0.0a1",
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


@pytest.fixture(scope="module")
def checker():
    def func(value: Any, oper: str, expected: Any):
        match oper:
            case "in":
                assert expected in value, f"{expected} not found in {value}"
            case "not in":
                assert expected not in value, f"{expected} found in {value}"
            case "eq":
                assert expected == value, f"{expected} != {value}"
            case "ne":
                assert expected != value, f"{expected} == {value}"
            case "is":
                assert value is expected, f"{value} is not {expected}"
            case "is not":
                assert value is not expected, f"{value} is {expected}"
            case "starts":
                assert value.startswith(expected), (
                    f"{value} does not start with {expected}"
                )
            case _:
                raise ValueError(f"Unknown operation: {oper}")

    return func


@pytest.fixture
def registry_checker(checker):
    """Fixture to check registry settings."""

    def func(record: str, oper: str, expected: Any):
        """Check registry settings."""
        value = api.portal.get_registry_record(record, default=None)
        return checker(value, oper, expected)

    return func
