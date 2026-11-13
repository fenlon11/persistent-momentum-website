#!/usr/bin/env python3
"""Collect recent AI news items from the sources in sources.json.

Step 1 of the persistentmomentum.com AI news pipeline (fenlon11/pmOS#686): collect -> draft.mjs ->
draft PR -> a human reviews and merges. Ported from ~/pmOS/projects/persistent-momentum/hubspot/tools/newsletter/ on 2026-10-10; this copy
is canonical now. This step only gathers links; it never writes copy.

Standard library only. One polite request per source, an honest User-Agent, and no attempt to get
past a block (a 403 is recorded and skipped, never spoofed). Writes <out>/items-<date>.json and keeps
first-seen dates in <out>/seen.json, so pages without dates still show what is new since the last run.
Exits 1 when 3 or more tier-1 sources fail: the week's draft would be missing whole companies.

Usage: python3 scripts/news/collect.py [--days 8] [--out DIR]
"""
import argparse
import gzip
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "out"
UA = "pm-news-collector/0.1 (+https://persistentmomentum.com)"
MAX_TIER1_FAILURES = 2
MAX_PER_SOURCE = 30
# Press items (tier "press") are kept only when they name a tracked company or one of these (pmOS#2661).
PRESS_TERMS = ["AI", "model", "models", "chip", "chips", "GPU", "GPUs", "data center", "data centers"]


def decode_body(encoding, body):
    """Some CDNs (DeepMind's) send gzip though we never ask for it; decompress it, raising if it is corrupt."""
    if (encoding or "").strip().lower() == "gzip" or body[:2] == b"\x1f\x8b":
        body = gzip.decompress(body)
    return body.decode("utf-8", errors="replace")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return decode_body(r.headers.get("Content-Encoding"), r.read())


def parse_date(text):
    if not text:
        return None
    text = text.strip()
    try:
        d = parsedate_to_datetime(text)  # RSS: RFC 822
    except (TypeError, ValueError):
        try:
            d = datetime.fromisoformat(text.replace("Z", "+00:00"))  # Atom: ISO 8601
        except ValueError:
            return None
    return d if d.tzinfo else d.replace(tzinfo=timezone.utc)


def heading_date(text, now, year=None):
    """Dates written on release-notes pages: "November 12, 2026", "Nov 10, 2026", or "Nov 5" (in `year`,
    the page's section year; without one, this year, or last year when that would be in the future)."""
    text = clean(text)
    for fmt in ("%B %d, %Y", "%b %d, %Y"):
        try:
            return datetime.strptime(text, fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            pass
    for fmt in ("%B %d", "%b %d"):
        try:
            d = datetime.strptime(f"{text} {year or now.year}", f"{fmt} %Y").replace(tzinfo=timezone.utc)
        except ValueError:
            continue
        return d if year or d <= now + timedelta(days=1) else d.replace(year=now.year - 1)
    return None


def clean(text):
    return html.unescape(re.sub(r"<[^>]+>", "", text or "")).strip()


def local(tag):
    return tag.rsplit("}", 1)[-1]  # drop the XML namespace


def parse_feed(body):
    """Yield (title, url, published, summary) from RSS 2.0 or Atom."""
    root = ET.fromstring(body)
    for el in root.iter():
        if local(el.tag) not in ("item", "entry"):
            continue
        f = {local(c.tag): c for c in el}
        # Atom entries can carry several links (e.g. NVIDIA adds rel="replies" comment feeds); take the article.
        links = [c for c in el if local(c.tag) == "link"]
        link = next((c for c in links if c.get("rel", "alternate") == "alternate"), links[0] if links else None)
        url = (link.get("href") or link.text or "").strip() if link is not None else ""
        when = next((f[k].text for k in ("pubDate", "published", "updated", "date") if k in f), None)
        summary = next((f[k].text for k in ("description", "summary", "content") if k in f), "")
        yield clean(f["title"].text if "title" in f else ""), url, parse_date(when), clean(summary)[:400]


def parse_html(body, src, now=None):
    """Group 1 is the title (or slug). Optional named groups: `title`, `slug` (fills url_template) and
    `date` (a heading date such as "November 12, 2026", which dates the item). A page whose dates carry no
    year ("Nov 5") names its section headings in `year_from`, a pattern whose group 1 is the year."""
    now = now or datetime.now(timezone.utc)
    years = [(y.start(), int(y.group(1))) for y in re.finditer(src["year_from"], body)] if "year_from" in src else []
    seen = set()
    for m in re.finditer(src["pattern"], body, re.S):
        g = m.groupdict()
        raw = clean(g["title"] if "title" in g else m.group(1))[:200]
        slug = clean(g["slug"]) if "slug" in g else raw
        if not raw or (slug, raw) in seen:
            continue
        seen.add((slug, raw))
        title = raw.replace("-", " ").capitalize() if src.get("title_from") == "slug" else raw
        url = src["url_template"].format(slug) if "url_template" in src else src["url"]
        year = next((y for pos, y in reversed(years) if pos < m.start()), None)
        yield title, url, heading_date(g["date"], now, year) if g.get("date") else None, ""


def keep(src, title, summary, press_words=()):
    words = press_words if src["tier"] == "press" else src.get("keywords")
    if not words:
        return True
    text = f"{title} {summary}"
    return any(re.search(rf"\b{re.escape(w)}\b", text, re.I if w != "AI" else 0) for w in words)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=8, help="window: one week plus a day of overlap")
    ap.add_argument("--out", type=Path, default=OUT, help="items and seen.json directory")
    args = ap.parse_args()
    days, out_dir = args.days, args.out
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=days)
    out_dir.mkdir(parents=True, exist_ok=True)
    seen_path = out_dir / "seen.json"
    seen = json.loads(seen_path.read_text()) if seen_path.exists() else {}
    first_run = not seen

    sources = json.loads((HERE / "sources.json").read_text())["sources"]
    press_words = sorted({s["company"] for s in sources if s["tier"] != "press"}) + PRESS_TERMS
    items, report, taken = [], [], set()
    for src in sources:
        try:
            body = fetch(src["url"])
            rows = list(parse_feed(body) if src["type"] == "feed" else parse_html(body, src, now))
            count = 0
            for title, url, published, summary in rows:
                if count >= MAX_PER_SOURCE or not keep(src, title, summary, press_words):
                    continue
                key = f"{src['id']}|{url}|{title}"
                if (url, title) in taken:  # feeds repeat items (NVIDIA lists some twice)
                    continue
                taken.add((url, title))
                first_seen = seen.setdefault(key, now.date().isoformat())
                when = published or datetime.fromisoformat(first_seen).replace(tzinfo=timezone.utc)
                if when < cutoff:
                    continue
                count += 1
                items.append({
                    "source": src["id"], "company": src["company"], "lab": src["lab"], "tier": src["tier"],
                    **({"outlet": src["outlet"]} if src["tier"] == "press" else {}),
                    "title": title, "url": url,
                    "published": published.isoformat() if published else None,
                    "first_seen": first_seen, "summary": summary,
                })
            # A page whose pattern matches nothing has changed shape: say so instead of reporting 0 as "ok".
            report.append((src["id"], "ok" if rows or src["type"] == "feed" else "error: pattern matched nothing",
                           count, src["tier"]))
        except Exception as e:  # one bad source must not stop the run; it's reported below
            report.append((src["id"], f"error: {type(e).__name__}: {e}"[:80], 0, src["tier"]))

    seen_path.write_text(json.dumps(seen, indent=0, sort_keys=True))
    out = out_dir / f"items-{now.date().isoformat()}.json"
    out.write_text(json.dumps({
        "collected_at": now.isoformat(), "window_days": days,
        "first_run": first_run,  # true: undated pages count everything as new; check dates on the page
        "items": items,
    }, indent=1))
    for sid, status, n, _ in report:
        print(f"{n:3d}  {status:<10.80}  {sid}")
    companies = sorted({i["company"] for i in items if i["tier"] in (1, 2)})
    print(f"\n{len(items)} items -> {out}\nprimary companies covered: {', '.join(companies)}")
    top = sorted({s["company"] for s in sources if s["lab"] == "top"})
    tier1 = {c: sum(1 for i in items if i["company"] == c and i["tier"] == 1) for c in top}
    print("top labs, tier-1 items: " + ", ".join(f"{c} {n}" for c, n in tier1.items()))
    if empty := [c for c, n in tier1.items() if n == 0]:
        print(f"top labs with no tier-1 items this window: {', '.join(empty)}")
    outlets = sorted({i["outlet"] for i in items if i["tier"] == "press"})
    print(f"press outlets with items: {len(outlets)} ({', '.join(outlets)})")
    tier1_failed = [sid for sid, status, _, tier in report if tier == 1 and status != "ok"]
    if len(tier1_failed) > MAX_TIER1_FAILURES:
        print(f"FAIL: {len(tier1_failed)} tier-1 sources failed: {', '.join(tier1_failed)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
