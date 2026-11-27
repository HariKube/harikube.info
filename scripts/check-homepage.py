#!/usr/bin/env python3
"""Check homepage structure, links, schema, and scoped CSS after a Hugo build.

Usage: python3 scripts/check-homepage.py /path/to/generated/site
"""

import argparse
import base64
import hashlib
import json
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
from pathlib import Path


class HomeParser(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.tags = []
        self.schema = []
        self.in_schema = False
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_schema = True
            self.schema.append("")

    def handle_data(self, data):
        if self.in_schema:
            self.schema[-1] += data

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_schema = False


def check_homepage(root):
    home = HomeParser(root / "index.html")
    assert sum(tag == "h1" for tag, _ in home.tags) == 1, "Expected one homepage H1"
    assert sum(tag == "main" for tag, _ in home.tags) == 1, "Expected one main landmark"
    assert not any(tag == "iframe" for tag, _ in home.tags), "Homepage must not preload a video iframe"
    ids = {attrs["id"] for _, attrs in home.tags if "id" in attrs}
    for tag, attrs in home.tags:
        if tag == "section":
            assert attrs.get("aria-labelledby") in ids, "Homepage section needs a heading label"
        if tag == "ol":
            assert attrs.get("role") == "list", "Markerless ordered lists must retain list semantics"
        if tag == "a":
            url = urlsplit(attrs.get("href", ""))
            if url.netloc not in ("", "harikube.info") or not url.path.startswith("/"):
                continue
            path = root / unquote(url.path).lstrip("/")
            if path.is_dir():
                path /= "index.html"
            assert path.is_file(), f"Broken homepage link: {url.geturl()}"
            if url.fragment:
                target = HomeParser(path)
                target_ids = {attrs.get("id") for _, attrs in target.tags}
                assert unquote(url.fragment) in target_ids, f"Missing fragment: {url.geturl()}"

    schemas = [json.loads(text) for text in home.schema]
    website = next(schema for schema in schemas if schema.get("@type") == "WebSite")
    assert website["name"] == "HariKube"
    assert website["url"] == "https://harikube.info/"
    assert website.get("description"), "Website schema needs a description"

    css = [attrs for tag, attrs in home.tags if tag == "link" and
           urlsplit(attrs.get("href", "")).path.startswith("/css/home.min.")]
    assert len(css) == 1, "Expected one fingerprinted homepage stylesheet"
    stylesheet = root / urlsplit(css[0]["href"]).path.lstrip("/")
    integrity = "sha256-" + base64.b64encode(hashlib.sha256(stylesheet.read_bytes()).digest()).decode()
    assert css[0].get("integrity") == integrity, "Homepage stylesheet integrity mismatch"
    article = HomeParser(root / "blog/create-microservice-with-operator/index.html")
    assert not any(attrs.get("href") == css[0]["href"] for _, attrs in article.tags), "Homepage CSS leaked onto an article"
    print("Homepage checks passed: landmarks, headings, links/fragments, list semantics, schema, and scoped CSS integrity.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site", type=Path, help="Hugo destination directory")
    check_homepage(parser.parse_args().site)
