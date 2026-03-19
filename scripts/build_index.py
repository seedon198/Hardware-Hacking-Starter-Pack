#!/usr/bin/env python3
"""
build-index.py — Generates frontend/content-index.json from sections/ markdown files.
Usage: python scripts/build-index.py [sections_root] [output_path]
"""

import json
import os
import re
import sys

SECTIONS_ROOT_DEFAULT = os.path.join(os.path.dirname(__file__), '..', 'sections')
OUTPUT_DEFAULT = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'content-index.json')

def _make_fallback_rules():
    return [
        (lambda path: re.search(r'01-foundations/', path), 'beginner'),
        (lambda path: re.search(r'wired/0[123]-', path), 'beginner'),
        (lambda path: re.search(r'wired/0[456]-', path), 'intermediate'),
        (lambda path: re.search(r'wireless/index', path), 'beginner'),
        (lambda path: re.search(r'wireless/01-', path), 'beginner'),
        (lambda path: re.search(r'wireless/0[2-6]-', path), 'intermediate'),
        (lambda path: re.search(r'03-firmware/', path), 'intermediate'),
        (lambda path: re.search(r'04-attack-vectors/01-physical', path), 'intermediate'),
        (lambda path: re.search(r'04-attack-vectors/0[2-5]', path), 'advanced'),
        (lambda path: re.search(r'05-reverse-engineering/0[1-4]-', path), 'intermediate'),
        (lambda path: re.search(r'05-reverse-engineering/05-', path), 'advanced'),
        (lambda path: re.search(r'06-embedded-security/01-secure-boot', path), 'advanced'),
        (lambda path: re.search(r'06-embedded-security/02-memory', path), 'advanced'),
        (lambda path: re.search(r'06-embedded-security/03-secure', path), 'advanced'),
        (lambda path: re.search(r'06-embedded-security/04-physical', path), 'intermediate'),
        (lambda path: re.search(r'06-embedded-security/05-security', path), 'advanced'),
        (lambda path: re.search(r'07-specialized-domains/', path), 'advanced'),
        (lambda path: re.search(r'08-professional/', path), 'all'),
        (lambda path: re.search(r'09-resources/', path), 'all'),
    ]

FALLBACK_RULES = _make_fallback_rules()


def _strip_leading_num(name):
    name = re.sub(r'^\d+-', '', name)
    return name.replace('-', ' ').title()


def _extract_metadata_comments(lines):
    difficulty = None
    tags = []
    for line in lines[:10]:
        m = re.match(r'<!--\s*difficulty:\s*(\w+)\s*-->', line.strip())
        if m:
            difficulty = m.group(1).lower()
        m = re.match(r'<!--\s*tags:\s*(.+?)\s*-->', line.strip())
        if m:
            tags = [t.strip() for t in m.group(1).split(',')]
    return difficulty, tags


def _extract_title(lines):
    for line in lines:
        m = re.match(r'^#\s+(.+)', line)
        if m:
            return m.group(1).strip()
    return None


def _extract_preview(content):
    lines = content.splitlines()
    in_code = False
    parts = []
    for line in lines:
        if line.strip().startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            continue
        if line.strip().startswith('#'):
            continue
        if line.strip().startswith('<!--') or line.strip().startswith('-->'):
            continue
        if line.strip().startswith('<'):
            continue
        text = line.strip()
        if text:
            parts.append(text)
        if sum(len(p) for p in parts) >= 300:
            break
    preview = ' '.join(parts)
    return preview[:300]


def _fallback_difficulty(rel_path):
    for rule_fn, diff in FALLBACK_RULES:
        if rule_fn(rel_path):
            return diff
    return 'beginner'


def _compute_index_difficulty(section_dir, all_entries):
    order = ['beginner', 'intermediate', 'advanced', 'all']
    all_siblings = [
        e for e in all_entries
        if not e['is_index'] and e['path'].startswith(section_dir)
    ]
    if not all_siblings:
        return 'beginner'
    # If all siblings are 'all', inherit 'all'
    non_all_siblings = [e for e in all_siblings if e['difficulty'] != 'all']
    if not non_all_siblings:
        return 'all'
    difficulties = [e['difficulty'] for e in non_all_siblings]
    for d in order:
        if d in difficulties:
            return d
    return 'beginner'


def build(sections_root):
    entries = []
    sections_root = os.path.abspath(sections_root)

    # Support being called with either the repo root (which contains sections/)
    # or the sections/ directory itself.
    sections_dir = os.path.join(sections_root, 'sections')
    if os.path.isdir(sections_dir):
        walk_root = sections_dir
        rel_base = sections_root
    else:
        walk_root = sections_root
        rel_base = os.path.dirname(sections_root)

    for dirpath, dirnames, filenames in os.walk(walk_root):
        dirnames.sort()
        for filename in sorted(filenames):
            if not filename.endswith('.md'):
                continue

            filepath = os.path.join(dirpath, filename)
            rel = os.path.relpath(filepath, rel_base)
            rel = rel.replace(os.sep, '/')
            path = rel[:-3]

            with open(filepath, encoding='utf-8') as f:
                content = f.read()
            lines = content.splitlines()

            # parts[0] = 'sections', parts[1] = section dir, parts[2] = subsection or file
            parts = path.split('/')
            sec_dir = parts[1] if len(parts) > 1 else parts[0]
            sec_num_m = re.match(r'^(\d+)-', sec_dir)
            section_num = int(sec_num_m.group(1)) if sec_num_m else 0
            section = _strip_leading_num(sec_dir)

            subsection = None
            if len(parts) >= 4:
                subsection = parts[2]

            is_index = filename == 'index.md'

            difficulty_comment, tags = _extract_metadata_comments(lines)
            title = _extract_title(lines)
            if not title:
                base = filename[:-3]
                title = base.replace('-', ' ').title()

            preview = _extract_preview(content)

            entries.append({
                'path': path,
                'title': title,
                'section_num': section_num,
                'section': section,
                'subsection': subsection,
                'is_index': is_index,
                'difficulty': difficulty_comment,
                'tags': tags,
                'preview': preview,
            })

    for e in entries:
        if e['difficulty'] is None and not e['is_index']:
            e['difficulty'] = _fallback_difficulty(e['path'])

    for e in entries:
        if e['difficulty'] is None and e['is_index']:
            path_parts = e['path'].split('/')
            # Use the directory containing the index file (all parts except the last)
            section_dir = '/'.join(path_parts[:-1]) + '/'
            e['difficulty'] = _compute_index_difficulty(section_dir, entries)

    return entries


def build_and_write(sections_root, output_path):
    entries = build(sections_root)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(entries)} entries to {output_path}")


if __name__ == '__main__':
    root = sys.argv[1] if len(sys.argv) > 1 else SECTIONS_ROOT_DEFAULT
    out = sys.argv[2] if len(sys.argv) > 2 else OUTPUT_DEFAULT
    build_and_write(root, out)
