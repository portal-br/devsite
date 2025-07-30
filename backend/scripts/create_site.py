from pathlib import Path
from portalbrasil.devsite.interfaces import IBrowserLayer
from portalbrasil.devsite.utils.scripts import create_site

import os


SCRIPT_DIR = Path().cwd() / "scripts"


def _string_as_list(value: str | None) -> list[str]:
    if not value:
        return []
    items = value.split(",")
    return [item.strip() for item in items]


# ANSWERS OVERRIDE
ANSWERS = {
    "site_id": os.getenv("SITE_ID"),
    "title": os.getenv("SITE_TITLE"),
    "description": os.getenv("SITE_DESCRIPTION"),
    "available_languages": _string_as_list(
        os.getenv("SITE_AVAILABLE_LANGUAGES", os.getenv("SITE_DEFAULT_LANGUAGE"))
    ),
    "portal_timezone": os.getenv("SITE_PORTAL_TIMEZONE"),
    "setup_content": os.getenv("SITE_SETUP_CONTENT", "true"),
}


def main():
    app = globals()["app"]
    filename = os.getenv("ANSWERS", "default.json")
    answers_file = SCRIPT_DIR / filename
    create_site(app, ANSWERS, answers_file, IBrowserLayer)


if __name__ == "__main__":
    main()
