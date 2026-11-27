#!/usr/bin/env python3
"""Check SEO metadata and learning-path links after a Hugo production build.

Usage: python3 scripts/check-seo.py /path/to/generated/site
"""

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta = {}
        self.canonical = []
        self.links = []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            key = attrs.get("name", attrs.get("property"))
            self.meta[key] = attrs.get("content", "")
        elif tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href", ""))
        elif tag == "a":
            self.links.append(attrs.get("href", ""))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def check_site(root):
    errors = []

    def check(condition, message):
        if not condition:
            errors.append(message)

    def load(route):
        path = root / route.strip("/") / "index.html"
        check(path.is_file(), f"Missing page: {route}")
        return Page(path) if path.is_file() else None

    routes = [
        "/", "/blog/", "/editions/", "/docs/overview/",
        "/features/performance/", "/features/consistency/", "/kubernetes-assessments/",
        "/contact-us/", "/get-started/", "/company/",
        "/docs/automation/", "/docs/future-plans/", "/features/event-streaming/",
        "/topics/", "/topics/kubernetes-scaling/",
        "/topics/kubernetes-operators/", "/topics/ai-infrastructure/",
    ]
    routes += [f"/blog/create-microservice-with-operator{suffix}/"
               for suffix in ("", "-2", "-3", "-4")]
    descriptions = set()
    for route in routes:
        page = load(route)
        if page is None:
            continue
        check(len(page.title) <= 70, f"Unexpectedly long title: {route}: {page.title}")
        description = page.meta.get("description", "")
        check(bool(description), f"Missing description: {route}")
        check(description not in descriptions, f"Repeated key-page description: {route}")
        descriptions.add(description)
        check(page.meta.get("og:title") == page.title, f"OG title mismatch: {route}")
        check(page.meta.get("twitter:title") == page.title, f"Twitter title mismatch: {route}")
        check(page.meta.get("og:description") == description, f"OG description mismatch: {route}")
        check(page.meta.get("twitter:description") == description, f"Twitter description mismatch: {route}")
        check(page.canonical == [f"https://harikube.info{route}"], f"Canonical mismatch: {route}")
        for field in ("og:image", "twitter:image"):
            check(page.meta.get(field, "").startswith("https://harikube.info/"),
                  f"Non-production preview image: {route}: {field}")

        if route.startswith("/topics/") or route in (
                "/", "/blog/", "/docs/overview/", "/features/event-streaming/",
                "/features/consistency/"):
            for href in page.links:
                url = urlsplit(href)
                if url.netloc not in ("", "harikube.info") or not url.path.startswith("/"):
                    continue
                target = root / unquote(url.path).lstrip("/")
                check(target.is_file() or (target / "index.html").is_file(),
                      f"Broken internal link: {route} -> {href}")

    # Every current blog article should use its own featured image unless an
    # explicit image override is supplied. Section pages are not articles.
    checked = 0
    for path in (root / "blog").glob("*/index.html"):
        page = Page(path)
        if page.meta.get("og:type") != "article":
            continue
        checked += 1
        image = page.meta.get("og:image", "")
        check(image == page.meta.get("twitter:image"), f"Social image mismatch: {path}")
        check(image.startswith("https://harikube.info/images/blog/"),
              f"Article did not use a blog preview image: {path}")
        check((root / unquote(urlsplit(image).path).lstrip("/")).is_file(),
              f"Missing article preview image: {path}: {image}")
    check(checked > 0, "No blog article previews checked")

    sitemap_path = root / "sitemap.xml"
    check(sitemap_path.is_file(), "Missing sitemap.xml")
    if sitemap_path.is_file():
        sitemap = ET.parse(sitemap_path)
        locations = sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
        check(bool(locations), "Empty sitemap")
        check(all((loc.text or "").startswith("https://harikube.info/") for loc in locations),
              "Sitemap contains non-production or relative URLs")

    if errors:
        raise SystemExit("SEO checks failed:\n- " + "\n- ".join(errors))
    print(f"SEO checks passed: {len(routes)} key pages, {checked} article previews, and learning-path links.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site", type=Path, help="Hugo destination directory")
    check_site(parser.parse_args().site)
