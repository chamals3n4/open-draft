CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM (
  'admin',
  'editor',
  'contributor'
);
CREATE TYPE user_status AS ENUM (
  'active',
  'suspended'
);
CREATE TYPE content_type AS ENUM (
  'post',
  'page',
  'documentation',
  'product',
  'landing_page'
);
CREATE TYPE content_status AS ENUM (
  'draft',
  'pending_review',
  'scheduled',
  'published',
  'archived'
);
CREATE TYPE content_visibility AS ENUM (
  'public',
  'private',
  'members_only'
);


CREATE TABLE profiles (
  id UUID PRIMARY KEY
    REFERENCES auth.users(id) ON DELETE CASCADE,

  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,

  role user_role NOT NULL DEFAULT 'contributor',
  status user_status NOT NULL DEFAULT 'active',

  -- User preferences (theme, editor settings, notifications)
  preferences JSONB DEFAULT '{}',

  last_seen_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  parent_id UUID REFERENCES categories(id),

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  type content_type NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  excerpt TEXT,

  body JSONB NOT NULL,
  body_format TEXT NOT NULL,

  status content_status NOT NULL DEFAULT 'draft',
  visibility content_visibility NOT NULL DEFAULT 'public',

  category_id UUID REFERENCES categories(id),
  thumbnail_url TEXT,
  author_id UUID REFERENCES profiles(id),

  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,

  is_featured BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE content_tags (
  content_id UUID
    REFERENCES contents(id) ON DELETE CASCADE,

  tag_id UUID
    REFERENCES tags(id) ON DELETE CASCADE,

  PRIMARY KEY (content_id, tag_id)
);

CREATE TABLE seo_meta (
  content_id UUID PRIMARY KEY
    REFERENCES contents(id) ON DELETE CASCADE,

  meta_title TEXT,
  meta_description TEXT,

  og_image_url TEXT,

  canonical_url TEXT,

  structured_data JSONB,

  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  content_id UUID
    REFERENCES contents(id) ON DELETE CASCADE,

  author_name TEXT NOT NULL,
  author_email TEXT,

  comment_text TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contents_status
  ON contents(status);

CREATE INDEX idx_contents_author
  ON contents(author_id);

CREATE INDEX idx_contents_category
  ON contents(category_id);

CREATE INDEX idx_content_tags_tag
  ON content_tags(tag_id);

CREATE INDEX idx_comments_content
  ON comments(content_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_published_content
ON contents
FOR SELECT
USING (status = 'published');

CREATE POLICY author_manage_own_content
ON contents
FOR ALL
USING (author_id = auth.uid());

CREATE POLICY admin_full_access
ON contents
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);