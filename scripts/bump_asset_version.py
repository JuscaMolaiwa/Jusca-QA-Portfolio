#!/usr/bin/env python3
"""
Bump cache-busting version query (?v=...) for local CSS/JS assets in index.html.
- Matches href/src that point to styles/*.css or scripts/*.js
- Replaces existing ?v=... (if any) with a UTC timestamp (YYYYMMDDHHMMSS)

Usage:
  python3 scripts/bump_asset_version.py
"""
from __future__ import annotations
import os
import re
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
INDEX = os.path.join(ROOT, 'index.html')

pattern = re.compile(r'(?P<prefix>(?:href|src)=["\"])'
                     r'(?P<path>(?:styles|scripts)/[^"\']+\.(?:css|js))'
                     r'(?P<query>\?v=[^"\']*)?'
                     r'(?P<suffix>["\"])')

def main() -> None:
    ts = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    try:
        with open(INDEX, 'r', encoding='utf-8') as f:
            html = f.read()
    except FileNotFoundError:
        print(f"Error: {INDEX} not found.")
        return

    def repl(m: re.Match) -> str:
        return f"{m.group('prefix')}{m.group('path')}?v={ts}{m.group('suffix')}"

    new_html, n = pattern.subn(repl, html)

    if n == 0:
        print('No local asset links found to update.')
        return

    with open(INDEX, 'w', encoding='utf-8') as f:
        f.write(new_html)

    print(f"Updated {n} asset reference(s) to version v={ts}")

if __name__ == '__main__':
    main()


# python3 scripts/bump_asset_version.py