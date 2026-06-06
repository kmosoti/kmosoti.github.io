from __future__ import annotations

import argparse
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markdown_it import MarkdownIt


REPO_ROOT = Path(__file__).resolve().parents[1]
ALLOWED_TYPES = {"doctrine", "field-note", "lab", "diagram", "experiment"}
ALLOWED_STATUSES = {
    "living",
    "working",
    "experiment",
    "local-only",
    "web-demo-planned",
    "needs-harness",
    "archived",
}
REQUIRED_FIELDS = {
    "title",
    "slug",
    "type",
    "status",
    "domain",
    "updated",
    "tags",
    "summary",
}


@dataclass(frozen=True)
class Page:
    source: Path
    meta: dict[str, Any]
    html: str
    body_markdown: str
    output_path: str

    @property
    def title(self) -> str:
        return str(self.meta["title"])

    @property
    def slug(self) -> str:
        return str(self.meta["slug"])

    @property
    def page_type(self) -> str:
        return str(self.meta["type"])

    @property
    def status(self) -> str:
        return str(self.meta["status"])

    @property
    def tags(self) -> list[str]:
        return list(self.meta.get("tags") or [])

    @property
    def summary(self) -> str:
        return str(self.meta["summary"])

    @property
    def url(self) -> str:
        return "/" + self.output_path.replace("\\", "/").removesuffix("index.html")


def parse_frontmatter(path: Path) -> tuple[dict[str, Any], str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError(f"{path}: missing YAML frontmatter")

    try:
        _, raw_meta, body = text.split("---\n", 2)
    except ValueError as exc:
        raise ValueError(f"{path}: malformed YAML frontmatter") from exc

    meta = yaml.safe_load(raw_meta) or {}
    if not isinstance(meta, dict):
        raise ValueError(f"{path}: frontmatter must be a mapping")

    missing = sorted(REQUIRED_FIELDS - set(meta))
    if missing:
        raise ValueError(f"{path}: missing required fields: {', '.join(missing)}")

    if meta["type"] not in ALLOWED_TYPES:
        raise ValueError(f"{path}: invalid type {meta['type']!r}")
    if meta["status"] not in ALLOWED_STATUSES:
        raise ValueError(f"{path}: invalid status {meta['status']!r}")
    if not isinstance(meta["tags"], list) or not all(isinstance(tag, str) for tag in meta["tags"]):
        raise ValueError(f"{path}: tags must be a list of strings")

    return meta, body.strip()


def output_path_for(meta: dict[str, Any]) -> str:
    slug = str(meta["slug"]).strip("/")
    page_type = meta["type"]
    if page_type == "doctrine":
        return f"notebook/doctrine/{slug}/index.html"
    if page_type == "field-note":
        return f"notebook/field-notes/{slug}/index.html"
    if page_type == "diagram":
        return f"notebook/diagrams/{slug}/index.html"
    if page_type == "experiment":
        return f"notebook/experiments/{slug}/index.html"
    if page_type == "lab":
        return f"labs/{slug}/index.html"
    raise ValueError(f"Unhandled page type: {page_type}")


def load_pages(content_dir: Path) -> list[Page]:
    md = MarkdownIt("commonmark", {"html": False, "linkify": True, "typographer": False})
    pages: list[Page] = []
    seen_slugs: set[tuple[str, str]] = set()

    for path in sorted(content_dir.rglob("*.md")):
        meta, body = parse_frontmatter(path)
        slug_key = (meta["type"], meta["slug"])
        if slug_key in seen_slugs:
            raise ValueError(f"{path}: duplicate slug {meta['type']}/{meta['slug']}")
        seen_slugs.add(slug_key)

        html = md.render(body)
        pages.append(
            Page(
                source=path,
                meta=meta,
                html=html,
                body_markdown=body,
                output_path=output_path_for(meta),
            )
        )

    return pages


def copy_static_assets(out_dir: Path) -> None:
    for name in ("assets",):
        src = REPO_ROOT / name
        dst = out_dir / name
        if src.resolve() == dst.resolve():
            continue
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)

    for filename in ("styles.css", "script.js", ".nojekyll"):
        src = REPO_ROOT / filename
        if src.exists() and src.resolve() != (out_dir / filename).resolve():
            shutil.copy2(src, out_dir / filename)


def write_page(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    clean_content = "\n".join(line.rstrip() for line in content.splitlines()) + "\n"
    path.write_text(clean_content, encoding="utf-8", newline="\n")


def group_pages(pages: list[Page]) -> dict[str, list[Page]]:
    groups = {kind: [] for kind in ALLOWED_TYPES}
    for page in pages:
        groups[page.page_type].append(page)
    for grouped in groups.values():
        grouped.sort(key=lambda item: (str(item.meta["updated"]), item.title), reverse=True)
    return groups


def internal_link_targets(out_dir: Path) -> set[str]:
    targets: set[str] = {"/", "/index.html"}
    for path in out_dir.rglob("*"):
        if path.is_file():
            rel = "/" + path.relative_to(out_dir).as_posix()
            targets.add(rel)
            if rel.endswith("/index.html"):
                targets.add(rel.removesuffix("index.html"))
    return targets


def check_links(out_dir: Path) -> None:
    targets = internal_link_targets(out_dir)
    pattern = re.compile(r"""(?:href|src)=["']([^"']+)["']""")
    failures: list[str] = []
    ignored_parts = {".git", ".github", "_site", "content", "scripts", "templates"}

    for path in out_dir.rglob("*.html"):
        rel_path = path.relative_to(out_dir)
        if ignored_parts.intersection(rel_path.parts):
            continue
        html = path.read_text(encoding="utf-8")
        for raw in pattern.findall(html):
            if raw.startswith(("http://", "https://", "mailto:", "#")):
                continue
            target = raw.split("#", 1)[0].split("?", 1)[0]
            if not target:
                continue
            if target.startswith("/"):
                normalized = target
            else:
                normalized = "/" + (path.parent / target).relative_to(out_dir).as_posix()
            if normalized not in targets:
                failures.append(f"{rel_path} -> {raw}")

    if failures:
        raise ValueError("Broken internal links:\n" + "\n".join(failures))


def render_site(content_dir: Path, templates_dir: Path, out_dir: Path) -> None:
    pages = load_pages(content_dir)
    groups = group_pages(pages)

    env = Environment(
        loader=FileSystemLoader(str(templates_dir)),
        autoescape=select_autoescape(("html", "xml")),
    )
    env.globals["status_label"] = lambda value: str(value).replace("-", " ")

    if out_dir.resolve() != REPO_ROOT.resolve():
        if out_dir.exists():
            shutil.rmtree(out_dir)
        out_dir.mkdir(parents=True)

    copy_static_assets(out_dir)

    base_context = {
        "pages": pages,
        "groups": groups,
        "site_title": "Kennedy Mosoti | Systems Notebook",
        "site_description": "A public systems notebook for observability, automation, platform work, doctrine, and project experiments.",
    }

    home_html = env.get_template("home.html").render(**base_context, title="Kennedy Mosoti")
    write_page(out_dir / "index.html", home_html)

    notebook_html = env.get_template("index_page.html").render(
        **base_context,
        title="Systems Notebook",
        eyebrow="Systems Notebook",
        heading="A public working surface.",
        intro="Notes, doctrine, project experiments, diagrams, and learning artifacts. Some pages are finished enough to be useful. Some are deliberately marked as living work.",
        page_set=pages,
        active_type="all",
    )
    write_page(out_dir / "notebook" / "index.html", notebook_html)

    category_specs = {
        "doctrine": ("Doctrine", "Rules for making hidden state visible and tools safer to operate.", "notebook/doctrine/index.html"),
        "field-note": ("Field Notes", "Operational observations, fragments, and things worth not relearning.", "notebook/field-notes/index.html"),
        "diagram": ("Diagrams", "Visual sketches for systems, workflows, and failure modes.", "notebook/diagrams/index.html"),
        "experiment": ("Experiments", "Small tests, rough edges, and ideas not ready to pretend they are products.", "notebook/experiments/index.html"),
        "lab": ("Project Labs", "Unfinished repos framed by what is real, fragile, and worth testing next.", "notebook/labs/index.html"),
    }
    for page_type, (heading, intro, output) in category_specs.items():
        html = env.get_template("index_page.html").render(
            **base_context,
            title=heading,
            eyebrow="Notebook Index",
            heading=heading,
            intro=intro,
            page_set=groups[page_type],
            active_type=page_type,
        )
        write_page(out_dir / output, html)

    labs_html = env.get_template("labs_index.html").render(**base_context, title="Project Labs")
    write_page(out_dir / "labs" / "index.html", labs_html)

    sandbox_html = env.get_template("resume_sandbox.html").render(
        **base_context,
        title="resume-builder sandbox",
    )
    write_page(out_dir / "labs" / "resume-builder" / "sandbox.html", sandbox_html)

    for page in pages:
        template_name = "lab.html" if page.page_type == "lab" else "note.html"
        html = env.get_template(template_name).render(**base_context, title=page.title, page=page)
        write_page(out_dir / page.output_path, html)

    check_links(out_dir)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render the Systems Notebook static site.")
    parser.add_argument("--content", default="content", type=Path)
    parser.add_argument("--templates", default="templates", type=Path)
    parser.add_argument("--out", default="_site", type=Path)
    args = parser.parse_args()

    content_dir = (REPO_ROOT / args.content).resolve() if not args.content.is_absolute() else args.content
    templates_dir = (REPO_ROOT / args.templates).resolve() if not args.templates.is_absolute() else args.templates
    out_dir = (REPO_ROOT / args.out).resolve() if not args.out.is_absolute() else args.out

    render_site(content_dir, templates_dir, out_dir)
    print(f"Rendered site to {out_dir}")


if __name__ == "__main__":
    main()
