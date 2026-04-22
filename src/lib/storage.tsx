// Facade over the preload-exposed window.storage / window.secrets.
// Provides a synchronous settings cache (populated at boot) plus async
// writes, and async templates + secrets APIs.
//
// Renderer code should always go through window.stStorage — never touch
// localStorage (legacy) or window.storage / window.secrets directly.

const state = {
  ready: false,
  settings: {},
  backend: null,
};

async function boot() {
  if (!window.storage || !window.secrets) {
    console.warn('[stStorage] preload bridge not available — running with empty cache');
    state.ready = true;
    return;
  }
  try {
    const [settings, backend] = await Promise.all([
      window.storage.settings.list(),
      window.secrets.backend(),
    ]);
    state.settings = settings || {};
    state.backend = backend;
  } catch (err) {
    console.error('[stStorage] boot failed', err);
  }
  state.ready = true;
}

function getSetting(key, fallback = null) {
  const v = state.settings[key];
  return v === undefined || v === null ? fallback : v;
}

function setSetting(key, value) {
  state.settings[key] = value;
  if (window.storage) {
    window.storage.settings.set(key, value).catch((err) =>
      console.error('[stStorage] set', key, err)
    );
  }
  return value;
}

function removeSetting(key) {
  delete state.settings[key];
  if (window.storage) {
    window.storage.settings.remove(key).catch((err) =>
      console.error('[stStorage] remove', key, err)
    );
  }
}

const templates = {
  list: () => (window.storage ? window.storage.templates.list() : Promise.resolve([])),
  read: (id) => (window.storage ? window.storage.templates.read(id) : Promise.resolve(null)),
  write: (id, doc) => (window.storage ? window.storage.templates.write(id, doc) : Promise.resolve(null)),
  remove: (id) => (window.storage ? window.storage.templates.remove(id) : Promise.resolve(false)),
  rename: (id, name) => (window.storage ? window.storage.templates.rename(id, name) : Promise.resolve(null)),
  newId: () => (window.storage ? window.storage.templates.newId() : Promise.resolve(null)),
};

const secrets = {
  get: (key) => (window.secrets ? window.secrets.get(key) : Promise.resolve(null)),
  set: (key, value) => (window.secrets ? window.secrets.set(key, value) : Promise.resolve(false)),
  remove: (key) => (window.secrets ? window.secrets.remove(key) : Promise.resolve(false)),
  backend: () => state.backend,
};

const stStorage = {
  boot,
  getSetting,
  setSetting,
  removeSetting,
  templates,
  secrets,
  _state: state,
};

Object.assign(window, { stStorage });
