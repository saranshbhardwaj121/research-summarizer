"""
arXiv API service using requests (more stable than urllib).
"""

import requests
import feedparser
from typing import List

ARXIV_API_URL = "http://export.arxiv.org/api/query"
MAX_RESULTS = 3


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
        papers.append(
            {
                "title": (entry.get("title") or "").strip().replace("\n", " "),
                "abstract": (entry.get("summary") or "").strip().replace("\n", " "),
                "published": entry.get("published") or "",
            }
        )

    return papers