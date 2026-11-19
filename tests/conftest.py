"""
Pytest configuration and shared fixtures for PharmaGraph CDS test suite.
"""

import pathlib
import sys
import pytest

ROOT_DIR = pathlib.Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))


@pytest.fixture
def specimens_dir():
    return ROOT_DIR / "data" / "specimens"
