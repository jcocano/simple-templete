// i18n — runtime translation layer
// API: window.stI18n.{ t, getLang, setLang, useLang, SUPPORTED, FALLBACK }
// Dictionaries register themselves on window.stI18nDict[<code>] (see src/lib/i18n/*.tsx).
// The current language lives in the workspace setting `editor.lang`. First boot
// autodetects from navigator.language and persists the choice.

const SUPPORTED = ['en', 'es', 'pt', 'fr', 'ja', 'zh'];
const FALLBACK = 'en';

function detectFromNavigator() {
  try {
    const nav = (navigator.language || FALLBACK).toLowerCase();
    const base = nav.split('-')[0];
    if (SUPPORTED.includes(base)) return base;
    if (nav.startsWith('zh')) return 'zh';
  } catch {}
  return FALLBACK;
}

function readSavedLang() {
  try {
    const ed = window.stStorage && window.stStorage.getWSSetting
      ? (window.stStorage.getWSSetting('editor', {}) || {})
      : {};
    if (ed.lang && SUPPORTED.includes(ed.lang)) return ed.lang;
  } catch {}
  return null;
}

function persistLang(code) {
  try {
    const ed = window.stStorage && window.stStorage.getWSSetting
      ? (window.stStorage.getWSSetting('editor', {}) || {})
      : {};
    window.stStorage && window.stStorage.setWSSetting
      && window.stStorage.setWSSetting('editor', { ...ed, lang: code });
  } catch {}
}

// Initial best-effort lang. stStorage.boot() is async and runs after this
// module loads, so we default to nav detection here and rehydrate from the
// workspace setting once boot() resolves (see `rehydrate` below).
let current = detectFromNavigator();

function rehydrate() {
  const saved = readSavedLang();
  if (saved) {
    if (saved !== current) {
      current = saved;
      window.dispatchEvent(new CustomEvent('st:lang-change', { detail: { lang: current } }));
    }
    return;
  }
  // No saved preference → persist the detected one so the selector reflects it.
  persistLang(current);
}

function lookup(lang, key) {
  const dict = window.stI18nDict && window.stI18nDict[lang];
  if (dict && Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
  return null;
}

function interpolate(str, params) {
  if (!params || typeof str !== 'string') return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

function t(key, params) {
  const v = lookup(current, key);
  const resolved = v != null ? v : lookup(FALLBACK, key);
  if (resolved == null) return key;
  return interpolate(resolved, params);
}

function getLang() { return current; }

function setLang(next) {
  if (!SUPPORTED.includes(next) || next === current) return;
  current = next;
  persistLang(next);
  window.dispatchEvent(new CustomEvent('st:lang-change', { detail: { lang: next } }));
}

// Re-read persisted lang when the user switches workspace — each workspace
// stores its own `editor.lang`.
window.addEventListener('st:workspace-change', () => {
  const saved = readSavedLang();
  const next = saved || detectFromNavigator();
  if (next !== current) {
    current = next;
    window.dispatchEvent(new CustomEvent('st:lang-change', { detail: { lang: next } }));
  }
});

function useLang() {
  const [lang, setL] = React.useState(current);
  React.useEffect(() => {
    const h = (e) => setL((e && e.detail && e.detail.lang) || current);
    window.addEventListener('st:lang-change', h);
    return () => window.removeEventListener('st:lang-change', h);
  }, []);
  return lang;
}

Object.assign(window, {
  stI18n: { t, getLang, setLang, useLang, rehydrate, SUPPORTED, FALLBACK },
});
