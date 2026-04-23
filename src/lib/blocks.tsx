// Saved blocks facade + React hooks. A saved block is a reusable email
// section (the full {layout, style, columns} shape), tagged with a `kind`
// and persisted per-workspace via window.stStorage. Mutations dispatch
// st:block-change so hooks re-list and the library UI stays fresh.
//
// Events emitted:
//   - st:block-change {id, kind:'create'|'update'|'rename'|'delete'|'restore'|'purge'|'seed'}
//
// Seeding: on first list() for a workspace, if the index is empty and
// we haven't seeded yet (wsSetting `saved_blocks_seeded`), we migrate the
// legacy SAVED_BLOCKS hardcoded list into real records so the library is
// not empty on first open. The flag prevents re-seeding after the user
// deletes everything.

const SEEDED_FLAG = 'saved_blocks_seeded';
const VALID_KINDS = new Set([
  'header', 'footer', 'cta', 'testimonial',
  'product', 'social', 'signature', 'custom',
]);

// Each kind maps to a section preset — concrete, renderable content so
// the user sees realistic previews in the library without having to
// craft every seed by hand. Styles mirror the defaults used by
// DEFAULT_SECTIONS (Beefree-shaped outer/inner walls).
function sectionForKind(kind) {
  const base = window.defaultSectionStyle || (() => ({}));
  const mkId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
  switch (kind) {
    case 'header':
      return {
        layout: '1col',
        style: base({ bg: '#ffffff', padding: 18 }),
        columns: [{ w: 100, blocks: [{ id: mkId('b'), type: 'header' }] }],
      };
    case 'footer':
      return {
        layout: '1col',
        style: base({ bg: '#f3f1fa', text: '#6a6a8a', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [{ id: mkId('b'), type: 'footer' }] }],
      };
    case 'cta':
      return {
        layout: '1col',
        style: base({ bg: '#ffffff', padding: 32, align: 'center' }),
        columns: [{
          w: 100,
          blocks: [{
            id: mkId('b'),
            type: 'button',
            data: { label: 'Comprar ahora', url: '#' },
          }],
        }],
      };
    case 'testimonial':
      return {
        layout: '1col',
        style: base({ bg: '#ffffff', padding: 24, align: 'center' }),
        columns: [{
          w: 100,
          blocks: [
            { id: mkId('b'), type: 'heading', data: { text: '"Gran servicio, muy recomendado."' } },
            { id: mkId('b'), type: 'text',    data: { body: '— María G.' } },
          ],
        }],
      };
    case 'product':
      return {
        layout: '2col',
        style: base({ bg: '#ffffff', padding: 28 }),
        columns: [
          { w: 50, blocks: [{ id: mkId('b'), type: 'product', data: { name: 'Producto 1', price: '$380 MXN' } }] },
          { w: 50, blocks: [{ id: mkId('b'), type: 'product', data: { name: 'Producto 2', price: '$220 MXN' } }] },
        ],
      };
    case 'social':
      return {
        layout: '1col',
        style: base({ bg: '#ffffff', padding: 18, align: 'center' }),
        columns: [{ w: 100, blocks: [{ id: mkId('b'), type: 'social' }] }],
      };
    case 'signature':
      return {
        layout: '1col',
        style: base({ bg: '#ffffff', padding: 20 }),
        columns: [{
          w: 100,
          blocks: [
            { id: mkId('b'), type: 'heading', data: { text: 'Carmen Luna' } },
            { id: mkId('b'), type: 'text',    data: { body: 'Acme · Fundadora' } },
          ],
        }],
      };
    default:
      return {
        layout: '1col',
        style: base({ bg: '#ffffff', padding: 24 }),
        columns: [{ w: 100, blocks: [] }],
      };
  }
}

// Migrates the legacy hardcoded SAVED_BLOCKS (src/data.tsx) to real
// records. Names match the original prototype so the UI looks the same
// on first open.
const SEED_SAVED_BLOCKS = [
  { name: 'Mi firma con foto',           kind: 'signature'  },
  { name: 'Footer legal con dirección',  kind: 'footer'     },
  { name: 'Mi header con logo',          kind: 'header'     },
  { name: 'Botón grande — reservar',     kind: 'cta'        },
  { name: 'Mis redes sociales',          kind: 'social'     },
  { name: 'Reseña de cliente',           kind: 'testimonial'},
  { name: 'Dos productos destacados',    kind: 'product'    },
  { name: 'Banner de oferta 40%',        kind: 'cta'        },
  { name: 'Link a agendar (Calendly)',   kind: 'cta'        },
  { name: 'Aviso legal corto',           kind: 'footer'     },
];

function normalizeDoc(blk) {
  if (!blk) return blk;
  const raw = blk.section;
  const section = raw && typeof raw === 'object'
    ? {
        layout: raw.layout || '1col',
        style: raw.style || (window.defaultSectionStyle ? window.defaultSectionStyle() : {}),
        columns: Array.isArray(raw.columns) ? raw.columns : [],
      }
    : sectionForKind(blk.kind);
  blk.section = section;
  if (!VALID_KINDS.has(blk.kind)) blk.kind = 'custom';
  return blk;
}

async function listBlocks() {
  if (!window.stStorage.getCurrentWorkspaceId()) return [];
  let rows = await window.stStorage.blocks.list();
  const seeded = window.stStorage.getWSSetting(SEEDED_FLAG, false);
  if (!seeded && Array.isArray(rows) && rows.length === 0) {
    await seedSavedBlocks();
    rows = await window.stStorage.blocks.list();
  }
  return rows;
}

async function listTrashedBlocks() {
  if (!window.stStorage.getCurrentWorkspaceId()) return [];
  return window.stStorage.blocks.listTrashed();
}

async function readBlock(id) {
  const blk = await window.stStorage.blocks.read(id);
  return normalizeDoc(blk);
}

async function writeBlock(id, doc) {
  const result = await window.stStorage.blocks.write(id, doc);
  if (result) {
    window.dispatchEvent(new CustomEvent('st:block-change', {
      detail: { id, kind: 'update' },
    }));
  }
  return result;
}

async function createBlock(seed = {}) {
  const id = await window.stStorage.blocks.newId();
  if (!id) return null;
  const kind = VALID_KINDS.has(seed.kind) ? seed.kind : 'custom';
  const doc = {
    id,
    schemaVersion: 1,
    name: seed.name || 'Bloque sin título',
    kind,
    starred: !!seed.starred,
    section: seed.section || sectionForKind(kind),
  };
  normalizeDoc(doc);
  const result = await window.stStorage.blocks.write(id, doc);
  if (!result) return null;
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id, kind: 'create' },
  }));
  return doc;
}

async function duplicateBlock(id) {
  const src = await readBlock(id);
  if (!src) return null;
  const newId = await window.stStorage.blocks.newId();
  const copy = { ...src, id: newId, name: `${src.name} (copia)`, starred: false };
  const result = await window.stStorage.blocks.write(newId, copy);
  if (!result) return null;
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id: newId, kind: 'create' },
  }));
  return copy;
}

async function renameBlock(id, name) {
  const doc = await readBlock(id);
  if (!doc) return null;
  doc.name = name;
  await window.stStorage.blocks.write(id, doc);
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id, kind: 'rename' },
  }));
  return doc;
}

async function deleteBlock(id) {
  await window.stStorage.blocks.remove(id);
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id, kind: 'delete' },
  }));
}

async function restoreBlock(id) {
  await window.stStorage.blocks.restore(id);
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id, kind: 'restore' },
  }));
}

async function purgeBlock(id) {
  await window.stStorage.blocks.purge(id);
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id, kind: 'purge' },
  }));
}

async function toggleBlockStar(id) {
  const doc = await readBlock(id);
  if (!doc) return null;
  doc.starred = !doc.starred;
  await window.stStorage.blocks.write(id, doc);
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id, kind: 'update' },
  }));
  return doc;
}

async function updateBlock(id, patch) {
  const doc = await readBlock(id);
  if (!doc) return null;
  Object.assign(doc, patch);
  await window.stStorage.blocks.write(id, doc);
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id, kind: 'update' },
  }));
  return doc;
}

async function setBlockKind(id, kind) {
  if (!VALID_KINDS.has(kind)) return null;
  return updateBlock(id, { kind });
}

// Seeds the legacy hardcoded SAVED_BLOCKS into the workspace. Idempotent
// via the `saved_blocks_seeded` wsSetting flag — once set, future empty
// lists don't re-seed (so deleting everything stays deleted).
async function seedSavedBlocks() {
  for (const seed of SEED_SAVED_BLOCKS) {
    const id = await window.stStorage.blocks.newId();
    if (!id) continue;
    const doc = {
      id,
      schemaVersion: 1,
      name: seed.name,
      kind: seed.kind,
      starred: false,
      section: sectionForKind(seed.kind),
    };
    await window.stStorage.blocks.write(id, doc);
  }
  window.stStorage.setWSSetting(SEEDED_FLAG, true);
  window.dispatchEvent(new CustomEvent('st:block-change', {
    detail: { id: null, kind: 'seed' },
  }));
}

function useBlocks() {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const list = await listBlocks();
      if (alive) setRows(list);
    };
    refresh();
    window.addEventListener('st:block-change', refresh);
    window.addEventListener('st:workspace-change', refresh);
    return () => {
      alive = false;
      window.removeEventListener('st:block-change', refresh);
      window.removeEventListener('st:workspace-change', refresh);
    };
  }, []);
  return rows;
}

function useTrashedBlocks() {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const list = await listTrashedBlocks();
      if (alive) setRows(list);
    };
    refresh();
    window.addEventListener('st:block-change', refresh);
    window.addEventListener('st:workspace-change', refresh);
    return () => {
      alive = false;
      window.removeEventListener('st:block-change', refresh);
      window.removeEventListener('st:workspace-change', refresh);
    };
  }, []);
  return rows;
}

const stBlocks = {
  list: listBlocks,
  listTrashed: listTrashedBlocks,
  read: readBlock,
  write: writeBlock,
  newId: () => window.stStorage.blocks.newId(),
  create: createBlock,
  duplicate: duplicateBlock,
  rename: renameBlock,
  remove: deleteBlock,
  restore: restoreBlock,
  purge: purgeBlock,
  toggleStar: toggleBlockStar,
  update: updateBlock,
  setKind: setBlockKind,
  seed: seedSavedBlocks,
  KINDS: Array.from(VALID_KINDS),
  sectionForKind,
};

Object.assign(window, { stBlocks, useBlocks, useTrashedBlocks });
