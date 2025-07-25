from pathlib import Path
from plone.distribution.api import distribution as dist_api
from plone.distribution.core import Distribution

import pytest


class TestRegistration:
    distribution: Distribution = None

    @pytest.fixture(autouse=True)
    def _dist_intranet(self, integration, distribution_name) -> Distribution:
        self.distribution = dist_api.get(name=distribution_name)

    def test_distribution_class(self):
        distribution = self.distribution
        assert isinstance(distribution, Distribution)

    @pytest.mark.parametrize(
        "attr,expected",
        [
            ["title", "Developer Site"],
            [
                "description",
                "Ferramenta de sites para profissionais de TI.",
            ],
        ],
    )
    def test_distribution_name_description(self, attr, expected):
        distribution = self.distribution
        assert isinstance(distribution, Distribution)
        assert getattr(distribution, attr) == expected

    def test_distribution_has_handler(self):
        distribution = self.distribution
        assert distribution.handler is not None

    def test_distribution_has_post_handler(self):
        distribution = self.distribution
        assert distribution.post_handler is not None

    def test_distribution_profiles(self):
        distribution = self.distribution
        assert len(distribution.profiles) == 0

    def test_distribution_has_image(self):
        distribution = self.distribution
        assert isinstance(distribution.image, Path)
        assert distribution.image.exists()

    def test_distribution_has_local_directory(self):
        distribution = self.distribution
        assert isinstance(distribution.directory, Path)
        assert distribution.directory.exists()
