"""
arXiv API service using requests (more stable than urllib).
"""

import requests
import feedparser
from typing import List

ARXIV_API_URL = "http://export.arxiv.org/api/query"
MAX_RESULTS = 3


def _normalize_arxiv_url(url: str) -> str:
    if not url:
        return ""
    url = url.strip()
    if url.startswith("http://arxiv.org/"):
        return "https://arxiv.org/" + url[len("http://arxiv.org/") :]
    if url.startswith("http://export.arxiv.org/"):
        return "https://arxiv.org/" + url[len("http://export.arxiv.org/") :]
    return url


def _extract_pdf_url(entry: dict) -> str:
    links = entry.get("links") or []
    for link in links:
        href = link.get("href") or ""
        link_type = (link.get("type") or "").lower()
        title = (link.get("title") or "").lower()
        if link_type == "application/pdf" or title == "pdf" or href.endswith(".pdf"):
            return _normalize_arxiv_url(href)

    abs_url = _normalize_arxiv_url(entry.get("id") or entry.get("link") or "")
    if "/abs/" in abs_url:
        return abs_url.replace("/abs/", "/pdf/")
    return ""


def fetch_papers(query: str) -> List[dict]:
    if not query or not query.strip():
        return []

    search_query = f"all:{query.strip()}"
    params = {
        "search_query": search_query,
        "start": 0,
        "max_results": MAX_RESULTS,
    }

    try:
        response = requests.get(
            ARXIV_API_URL,
            params=params,
            headers={"User-Agent": "ResearchSummarizerApp/1.0"},
            timeout=10,
        )
        response.raise_for_status()
        xml_data = response.content

    except Exception as e:
        print("arXiv request failed:", e)
        return []

    feed = feedparser.parse(xml_data)

    papers = []
    for entry in feed.entries:
        abs_url = _normalize_arxiv_url(entry.get("id") or entry.get("link") or "")
        papers.append(
            {
                "title": (entry.get("title") or "").strip().replace("\n", " "),
                "abstract": (entry.get("summary") or "").strip().replace("\n", " "),
                "published": entry.get("published") or "",
                "url": abs_url,
                "pdf_url": _extract_pdf_url(entry),
            }
        )

    return papers