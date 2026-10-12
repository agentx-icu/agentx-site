#!/usr/bin/env python3
"""Static checks for the agentx.icu page.

Fails (exit 1) when index.html or 404.html reference a local file that does
not exist, when the JSON-LD block is not valid JSON, when an English string
has no Chinese counterpart (or the reverse), or when a project card's
platform tags disagree with the operatingSystem in the JSON-LD.

Usage: python3 tools/check_site.py
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids, self.anchors = [], set(), []
        self.pairs = []  # language of each .en / .zh span

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.add(a['id'])
        for key in ('href', 'src'):
            v = a.get(key)
            if v and v.startswith('#'):
                self.anchors.append(v[1:])
            elif v and not re.match(r'[a-z]+:|//', v):
                self.refs.append(v)
        cls = a.get('class', '').split()
        if tag == 'span' and ('en' in cls or 'zh' in cls):
            self.pairs.append('en' if 'en' in cls else 'zh')


def check(name, errors):
    src = (ROOT / name).read_text(encoding='utf-8')
    page = Page()
    page.feed(src)
    # Absolute URLs into this site (og:image, JSON-LD logo) must exist too.
    page.refs += re.findall(r'https://agentx\.icu/(assets/[^"\s]+)', src)
    for ref in page.refs:
        path = ref.split('#')[0].split('?')[0]
        if path in ('', './', '/'):
            continue
        if not (ROOT / path.lstrip('/')).is_file():
            errors.append(f'{name}: missing file {ref}')
    for anchor in page.anchors:
        if anchor and anchor not in page.ids:
            errors.append(f'{name}: no element with id "{anchor}"')
    en = page.pairs.count('en')
    zh = len(page.pairs) - en
    if en != zh:
        errors.append(f'{name}: {en} English spans but {zh} Chinese spans')
    return src


def main():
    errors = []
    src = check('index.html', errors)
    check('404.html', errors)

    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', src, re.S)
    try:
        ld = json.loads(m.group(1)) if m else None
    except ValueError as e:
        ld = None
        errors.append(f'index.html: JSON-LD is not valid JSON: {e}')
    if m is None:
        errors.append('index.html: no JSON-LD block')
    if ld:
        apps = {a['name']: a for a in ld.get('hasPart', [])}
        for card in re.findall(r'<article class="project-card.*?</article>', src, re.S):
            name = re.search(r'<h3>([^<]+)</h3>', card).group(1)
            tags = re.search(r'<div class="tag-row">(.*?)</div>', card).group(1)
            tags = set(re.findall(r'<span>([^<]+)</span>', tags))
            if name not in apps:
                errors.append(f'index.html: card {name} is missing from JSON-LD hasPart')
                continue
            os_list = {s.strip() for s in apps[name].get('operatingSystem', '').split(',')}
            if tags != os_list:
                errors.append(f'index.html: {name} tags {sorted(tags)} != JSON-LD operatingSystem {sorted(os_list)}')

    if errors:
        print('Site check failed:')
        for e in errors:
            print('  - ' + e)
        return 1
    print('Site check passed.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
