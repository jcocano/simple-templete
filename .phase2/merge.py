#!/usr/bin/env python3
"""
Merge .phase2/*.json translation files into src/lib/i18n/{en,es,pt,fr,ja,zh}.tsx.
Idempotent: strips any prior `// === Phase 2 ===` block and rebuilds it.
Safely escapes newlines, quotes, and backslashes for JS single-quoted strings.
"""
import json, re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOCALES = ['en', 'es', 'pt', 'fr', 'ja', 'zh']
DICT_DIR = ROOT / 'src' / 'lib' / 'i18n'
PHASE2_DIR = ROOT / '.phase2'
MARKER = '// === Phase 2 ==='

def load_translations():
    merged = {}
    dupes = []
    for f in sorted(PHASE2_DIR.glob('*.json')):
        if f.name.startswith('_'):
            continue  # skip working files like _pairs.json
        with open(f) as fh:
            data = json.load(fh)
        for key, loc in data.items():
            if key in merged:
                dupes.append((key, f.name))
            merged[key] = loc
    if dupes:
        print(f'Note: {len(dupes)} duplicate keys resolved (later file wins)', file=sys.stderr)
    return merged

def js_escape(s):
    # Order matters: backslash first.
    return (s.replace('\\', '\\\\')
             .replace("'", "\\'")
             .replace('\n', '\\n')
             .replace('\r', '\\r')
             .replace('\t', '\\t'))

def strip_existing_phase2(text):
    """Remove a prior // === Phase 2 === block up to the closing };."""
    idx = text.find(MARKER)
    if idx < 0:
        return text
    # Rewind to the start of the comment line (include leading whitespace).
    line_start = text.rfind('\n', 0, idx) + 1
    # Find the closing `};` after the marker.
    close_idx = text.index('};', idx)
    return text[:line_start].rstrip() + '\n' + text[close_idx:]

def inject(locale, translations, existing_keys_other_blocks):
    path = DICT_DIR / f'{locale}.tsx'
    text = path.read_text()
    text = strip_existing_phase2(text)
    # Only include keys not already present in the file outside the phase 2 block.
    # We re-read existing keys after stripping.
    pre_keys = set(re.findall(r"^\s*'([a-z][a-zA-Z0-9._]+)'\s*:", text, re.MULTILINE))
    to_add = []
    for k in sorted(translations):
        if k in pre_keys:
            continue
        v = translations[k].get(locale)
        if v is None or v == '':
            continue  # fallback to EN will kick in
        to_add.append((k, v))
    if not to_add:
        path.write_text(text)
        return 0
    block = ['', '  ' + MARKER]
    for k, v in to_add:
        block.append(f"  '{k}': '{js_escape(v)}',")
    insert_at = text.rindex('};')
    new_text = text[:insert_at] + '\n'.join(block) + '\n' + text[insert_at:]
    path.write_text(new_text)
    return len(to_add)

def main():
    translations = load_translations()
    print(f'Loaded {len(translations)} keys from .phase2/*.json')
    for loc in LOCALES:
        n = inject(loc, translations, None)
        print(f'  {loc}: +{n} keys')

if __name__ == '__main__':
    main()
