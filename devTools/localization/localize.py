#!/usr/bin/env python3
"""Handles automatic creation of localization files.

Script author discord (asnden <@399934347911626772>)
Shares project license.
"""

import re
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Final


@dataclass
class LocaleEntry:
    original: str
    id: str

    filepath: Path
    line: int

    translation: str = ""
    comments: str = ""
    warning: bool = False

    def copy(self) -> LocaleEntry:
        return LocaleEntry(
            original=self.original,
            id=self.id,
            filepath=self.filepath,
            line=self.line,
            translation=self.translation,
            comments=self.comments,
            warning=self.warning,
        )


LocalesDict = dict[str, LocaleEntry]


class GameFilesParser:
    MACROS_REGEX: Final = re.compile(
        r'<<t(?:\s+"(?P<id>[^"]+)")?>>(?P<text>.*?)<</t>>',
        re.DOTALL,
    )

    CODE_REGEX: Final = re.compile(
        r'setup\.t\("(?P<text>(?:\\.|[^"\\])*)"(?:,\s*"(?P<id>[^"]+)")?\)'
    )

    @classmethod
    def parse_and_update_file(cls, filepath: Path) -> dict[str, LocaleEntry]:
        locales: dict[str, LocaleEntry] = {}

        filename = filepath.stem
        content = filepath.read_text(encoding="utf-8-sig")

        def modify_macros(match: re.Match[str]) -> str:
            text = match.group("text")
            locale_id = match.group("id") or cls._generate_id(filename)

            locales[locale_id] = LocaleEntry(
                original=text,
                id=locale_id,
                filepath=filepath,
                line=cls._get_line_number(content, match.start()),
            )

            return f'<<t "{locale_id}">>{text}<</t>>'

        def modify_code(match: re.Match[str]) -> str:
            text = match.group("text")
            locale_id = match.group("id") or cls._generate_id(filename)

            locales[locale_id] = LocaleEntry(
                original=text,
                id=locale_id,
                filepath=filepath,
                line=cls._get_line_number(content, match.start()),
            )

            return f'setup.t("{text}", "{locale_id}")'

        updated_content = cls.MACROS_REGEX.sub(modify_macros, content)
        updated_content = cls.CODE_REGEX.sub(modify_code, updated_content)

        if updated_content != content:
            _ = filepath.write_text(updated_content, encoding="utf-8")

        return locales

    @staticmethod
    def _generate_id(filename: str) -> str:
        return f"{filename}-{uuid.uuid4().hex[:8]}"

    @staticmethod
    def _get_line_number(text: str, char_index: int) -> int:
        return text.count("\n", 0, char_index) + 1


class LocaleFilesParser:
    LOCALE_ENTRY_REGEX: Final = re.compile(
        r"""
    (?P<comments>
        (?:
            \s*//(?!\s*[^:\n]+:\d+\n)[^\n]*\n
        )*
    )
    \s*//\s*(?P<path>[^:\n]+):(?P<line>\d+)\n
    \s*//\s*(?P<original>.*)\n
    \s*"(?P<id>[^"]+)"\s*:\s*"(?P<translation>(?:\\.|[^"])*)"
    """,
        re.MULTILINE | re.VERBOSE,
    )

    @classmethod
    def parse_locale_file(cls, filepath: Path) -> dict[str, LocaleEntry]:
        locales: dict[str, LocaleEntry] = {}

        try:
            content = filepath.read_text(encoding="utf-8-sig")
        except OSError:
            return {}

        for match in cls.LOCALE_ENTRY_REGEX.finditer(content):
            locale_id = match.group("id")

            locales[locale_id] = LocaleEntry(
                original=match.group("original"),
                id=locale_id,
                filepath=Path(match.group("path")),
                line=int(match.group("line")),
                comments=match.group("comments") or "",
                translation=match.group("translation"),
            )

        return locales


class LocalizationManager:
    def __init__(self, root_dir: Path) -> None:
        self.root_dir: Final = root_dir
        self.game_dir: Final = self.root_dir / "game"
        self.locale_dir: Final = self.game_dir / "03-JavaScript" / "locale"

    def sync_localization(self) -> None:
        for langdir in self.locale_dir.iterdir():
            if langdir.is_file():
                continue
            for pattern in ("*.twee", "*.js"):
                for filepath in self.game_dir.rglob(pattern):
                    # don't parse locale files
                    if filepath.resolve().is_relative_to(self.locale_dir):
                        continue

                    relative_path = filepath.resolve().relative_to(self.game_dir)
                    locale_filepath = (langdir / relative_path).with_suffix(".js")

                    self._sync_file(langdir, filepath, locale_filepath)

    def _sync_file(
        self,
        langdir: Path,
        game_filepath: Path,
        locale_filepath: Path,
    ) -> None:
        lang = langdir.name
        game_locales = GameFilesParser.parse_and_update_file(game_filepath)
        current_locales = LocaleFilesParser.parse_locale_file(locale_filepath)

        new_locales = self._get_new_locales(game_locales, current_locales)
        self._write_locale_file(lang, locale_filepath, new_locales)

    def _get_new_locales(
        self, game_locales: LocalesDict, current_locales: LocalesDict
    ) -> LocalesDict:
        new_locales: LocalesDict = {}
        for key, locale in game_locales.items():
            new_locale = locale.copy()
            current_locale = current_locales.get(key)

            if not current_locale:
                new_locales[key] = new_locale
                continue

            if locale.original != current_locale.original:
                new_locale.warning = True

            new_locale.translation = current_locale.translation

            # Don't save if there is no comments
            if current_locale.comments.strip():
                new_locale.comments = current_locale.comments

            new_locales[key] = new_locale

        if new_locales:
            print(new_locales)

        return new_locales

    def _write_locale_file(
        self, lang: str, filepath: Path, locales: LocalesDict
    ) -> None:

        if not locales:
            return

        filepath.parent.mkdir(parents=True, exist_ok=True)

        with filepath.open("w", encoding="utf-8") as f:
            _ = f.write("// THIS FILE IS AUTOGENERATED\n")
            _ = f.write("// DO NOT EDIT ORIGINAL TEXT\n")
            _ = f.write("// You CAN add comments ABOVE filepath\n")
            _ = f.write("// You CAN delete WARNINGS if you are sure\n")
            _ = f.write("// that translation IS CORRECT\n")
            _ = f.write(f'Object.assign(setup.i18n["{lang}"], {{\n')

            first = True
            for locale in locales.values():
                if not first:
                    _ = f.write("\n")
                first = False

                if locale.comments.strip():
                    for line in locale.comments.strip().splitlines():
                        clean_line = line.strip()
                        if clean_line:
                            _ = f.write(f"\t{clean_line}\n")

                if locale.warning:
                    _ = f.write(
                        "\t// WARNING: original text changed. Rereview translation\n"
                    )

                relative_path = locale.filepath.relative_to(self.game_dir)
                _ = f.write(f"\t// {relative_path.as_posix()}:{locale.line}\n")
                _ = f.write(f"\t// {locale.original}\n")
                _ = f.write(f'\t"{locale.id}": "{locale.translation}",\n')

            _ = f.write("});\n")


def main() -> None:

    script_dir = Path(__file__).resolve().parent
    default_root = script_dir.parent.parent

    manager = LocalizationManager(default_root)
    manager.sync_localization()


if __name__ == "__main__":
    main()
