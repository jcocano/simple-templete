const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { templatesDir, ensureDirs } = require('./paths');
const db = require('./db');

const ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;

function filePath(id) {
  if (!ID_RE.test(id)) throw new Error(`invalid template id: ${id}`);
  return path.join(templatesDir(), `${id}.json`);
}

function list() {
  return db
    .get()
    .prepare(
      `SELECT id, name, created_at, updated_at
       FROM templates_index
       ORDER BY updated_at DESC`
    )
    .all();
}

function read(id) {
  const p = filePath(id);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function write(id, doc) {
  ensureDirs();
  const p = filePath(id);
  const tmp = `${p}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(doc, null, 2), 'utf8');
  fs.renameSync(tmp, p);
  const name = doc && typeof doc.name === 'string' ? doc.name : 'Sin título';
  db.get()
    .prepare(
      `INSERT INTO templates_index (id, name, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, updated_at = excluded.updated_at`
    )
    .run(id, name);
  return { id, name };
}

function remove(id) {
  const p = filePath(id);
  if (fs.existsSync(p)) fs.unlinkSync(p);
  db.get().prepare('DELETE FROM templates_index WHERE id = ?').run(id);
}

function rename(id, name) {
  const doc = read(id);
  if (!doc) return null;
  doc.name = name;
  return write(id, doc);
}

function newId() {
  return `tpl_${crypto.randomBytes(8).toString('hex')}`;
}

module.exports = { list, read, write, remove, rename, newId };
