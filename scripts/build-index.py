#!/usr/bin/env python3
"""
build-index.py — CLI entry point for generating frontend/content-index.json.
Usage: python scripts/build-index.py [sections_root] [output_path]
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from build_index import build_and_write, SECTIONS_ROOT_DEFAULT, OUTPUT_DEFAULT

if __name__ == '__main__':
    root = sys.argv[1] if len(sys.argv) > 1 else SECTIONS_ROOT_DEFAULT
    out = sys.argv[2] if len(sys.argv) > 2 else OUTPUT_DEFAULT
    build_and_write(root, out)
