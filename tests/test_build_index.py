import json
import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))
import build_index

FIXTURE_ROOT = os.path.join(os.path.dirname(__file__), 'fixtures')


def get_entries(root=FIXTURE_ROOT):
    return build_index.build(root)


def find(entries, path_suffix):
    return next((e for e in entries if e['path'].endswith(path_suffix)), None)


class TestPathField:
    def test_no_md_extension(self):
        entries = get_entries()
        for e in entries:
            assert not e['path'].endswith('.md')

    def test_sections_prefix(self):
        entries = get_entries()
        for e in entries:
            assert e['path'].startswith('sections/')

    def test_specific_path(self):
        entries = get_entries()
        e = find(entries, '01-foundations/01-introduction')
        assert e is not None, "01-foundations/01-introduction not found in fixture entries"
        assert e['path'] == 'sections/01-foundations/01-introduction'


class TestTitleField:
    def test_extracts_h1(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e is not None, "01-introduction not found in fixture entries"
        assert e['title'] == 'Introduction to Hardware Hacking'

    def test_fallback_filename(self, tmp_path):
        sec = tmp_path / 'sections' / '01-foundations'
        sec.mkdir(parents=True)
        (sec / 'no-heading.md').write_text('Just some text without a heading.')
        entries = build_index.build(str(tmp_path))
        e = find(entries, 'no-heading')
        assert e['title'] == 'No Heading'


class TestSectionFields:
    def test_section_num(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['section_num'] == 1

    def test_section_name(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['section'] == 'Foundations'

    def test_subsection_null_for_flat(self):
        entries = get_entries()
        e = find(entries, '01-foundations/01-introduction')
        assert e['subsection'] is None

    def test_subsection_wired(self):
        entries = get_entries()
        e = find(entries, 'wired/01-uart-protocol')
        assert e is not None, "wired/01-uart-protocol not found in fixture entries"
        assert e['subsection'] == 'wired'


class TestIsIndex:
    def test_index_file(self):
        entries = get_entries()
        e = find(entries, '01-foundations/index')
        assert e['is_index'] is True

    def test_non_index_file(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['is_index'] is False


class TestDifficulty:
    def test_reads_comment(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['difficulty'] == 'beginner'

    def test_explicit_comment_overrides_fallback(self):
        entries = get_entries()
        e = find(entries, '02-communication-protocols/index')
        assert e['difficulty'] == 'intermediate'


class TestTags:
    def test_reads_tags(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['tags'] == ['foundations', 'intro']

    def test_empty_tags_when_absent(self):
        entries = get_entries()
        e = find(entries, '01-uart-protocol')
        assert e['tags'] == []


class TestPreview:
    def test_excludes_headings(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert 'Introduction to Hardware Hacking' not in e['preview']

    def test_excludes_code_blocks(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert '```' not in e['preview']
        assert 'USB' not in e['preview']

    def test_excludes_html_comments(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert '<!--' not in e['preview']

    def test_max_300_chars(self):
        entries = get_entries()
        for e in entries:
            assert len(e['preview']) <= 300


class TestIndexDifficulty:
    def test_index_inherits_siblings(self, tmp_path):
        """index.md in a section with only intermediate files should get intermediate."""
        sec = tmp_path / 'sections' / '03-firmware'
        sec.mkdir(parents=True)
        (sec / 'index.md').write_text('# Firmware\n\nOverview.')
        (sec / '01-analysis.md').write_text('# Analysis\n\nFirmware analysis content.')
        entries = build_index.build(str(tmp_path))
        idx = next(e for e in entries if e['is_index'])
        # 03-firmware fallback is intermediate
        assert idx['difficulty'] == 'intermediate'

    def test_index_inherits_all_when_all_siblings_are_all(self, tmp_path):
        """index.md in a section where all siblings are 'all' should get 'all'."""
        sec = tmp_path / 'sections' / '08-professional'
        sec.mkdir(parents=True)
        (sec / 'index.md').write_text('# Professional\n\nOverview.')
        (sec / '01-learning-path.md').write_text('# Learning Path\n\nContent.')
        entries = build_index.build(str(tmp_path))
        idx = next(e for e in entries if e['is_index'])
        assert idx['difficulty'] == 'all'


class TestOutputJSON:
    def test_writes_valid_json(self, tmp_path):
        out_path = tmp_path / 'content-index.json'
        build_index.build_and_write(FIXTURE_ROOT, str(out_path))
        with open(out_path) as f:
            data = json.load(f)
        assert isinstance(data, list)
        assert len(data) > 0
