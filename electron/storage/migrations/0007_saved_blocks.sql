-- Saved blocks: reusable email sections (header/footer/cta/etc.) that the
-- user can save, favorite, classify by `kind`, and trash. Mirrors the
-- templates_index shape (soft-delete, workspace-scoped) so the UI and lib
-- layers can reuse the same patterns.
--
-- `kind` is the taxonomy shown in the library and in the "Mis bloques"
-- panel of the editor (header/footer/cta/testimonial/product/social/
-- signature/custom). Indexed because both UIs filter by it.
-- `starred` lives in the index (not in the JSON) so the favorites filter
-- doesn't need to read every JSON file.

CREATE TABLE saved_blocks_index (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'custom',
  starred INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_saved_blocks_workspace_updated
  ON saved_blocks_index(workspace_id, updated_at DESC);

CREATE INDEX idx_saved_blocks_deleted
  ON saved_blocks_index(deleted_at);

CREATE INDEX idx_saved_blocks_kind
  ON saved_blocks_index(workspace_id, kind);
