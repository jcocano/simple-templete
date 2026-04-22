// One-shot migration from legacy `mc:*` localStorage keys into the
// SQLite-backed settings + safeStorage-backed secrets.
// Runs once per install; tracked by the `__legacy_migrated` flag in settings.

async function stMigrateLegacy() {
  if (window.stStorage.getSetting('__legacy_migrated', false)) return;

  const ls = (k) => {
    try { return localStorage.getItem(k); } catch { return null; }
  };
  const lsJSON = (k) => {
    const v = ls(k);
    if (v == null) return null;
    try { return JSON.parse(v); } catch { return null; }
  };

  const screen = ls('mc:screen');
  if (screen) window.stStorage.setSetting('screen', screen);

  const onboard = ls('mc:onboard');
  if (onboard != null) window.stStorage.setSetting('onboard', onboard === 'done');

  const tour = ls('mc:tour-seen');
  if (tour != null) window.stStorage.setSetting('tour-seen', tour === '1');

  const prov = ls('mc:delivery:provider');
  if (prov) window.stStorage.setSetting('delivery:provider', prov);

  const conn = ls('mc:delivery:connected');
  if (conn != null) window.stStorage.setSetting('delivery:connected', conn === 'true');

  for (const name of ['tweaks','account','storage','brand','editor','vars','export','notif','ai']) {
    const v = lsJSON('mc:' + name);
    if (v !== null) window.stStorage.setSetting(name, v);
  }

  for (const p of ['gmail','outlook','yahoo','icloud','smtp']) {
    const raw = ls(`mc:delivery:cfg:${p}`);
    if (raw) {
      try {
        await window.stStorage.secrets.set(`delivery:cfg:${p}`, raw);
      } catch (err) {
        console.error('[stMigrateLegacy] secret', p, err);
      }
    }
  }

  window.stStorage.setSetting('__legacy_migrated', true);

  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) if (k.startsWith('mc:')) localStorage.removeItem(k);
  } catch {}
}

Object.assign(window, { stMigrateLegacy });
