PRAGMA foreign_keys = ON;

CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE posts (
  slug TEXT PRIMARY KEY CHECK (length(slug) BETWEEN 1 AND 180 AND slug NOT GLOB '*[^a-z0-9().-]*'),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES categories(slug),
  body_html TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  cover_path TEXT NOT NULL CHECK (cover_path LIKE '/assets/%'),
  author TEXT NOT NULL DEFAULT 'The BIG team',
  updated_at TEXT NOT NULL,
  reading_minutes INTEGER NOT NULL CHECK (reading_minutes > 0),
  toc_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(toc_json)),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  sort_order INTEGER NOT NULL DEFAULT 100
);
CREATE INDEX idx_posts_publication ON posts(status, sort_order, updated_at DESC);

CREATE TABLE post_sources (
  post_slug TEXT NOT NULL REFERENCES posts(slug) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL CHECK (url LIKE 'https://%'),
  PRIMARY KEY (post_slug, position)
);

CREATE TABLE redirects (
  source_path TEXT PRIMARY KEY CHECK (source_path LIKE '/blog/%' AND source_path NOT LIKE '%?%' AND source_path NOT LIKE '%#%'),
  target_path TEXT NOT NULL CHECK (target_path LIKE '/%' AND target_path NOT LIKE '//%' AND instr(target_path, char(92)) = 0 AND instr(target_path, char(10)) = 0 AND instr(target_path, char(13)) = 0),
  status_code INTEGER NOT NULL DEFAULT 301 CHECK (status_code IN (301,302,307,308)),
  CHECK (source_path != target_path)
);
