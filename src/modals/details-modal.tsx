// Details modal edits email subject, preheader, and plain-text body.
//
// It opens from the editor toolbar and from Review fixes (`st:open-details`).
// Persistence goes through `window.__stEditor.setMeta()`, then editor flushes
// to storage. If plain text is missing, we generate it from the live editor
// snapshot (not from possibly stale template props).

function DetailsModal({ onClose }) {
  const t = window.stI18n.t;
  window.stI18n.useLang();

  const initial = React.useMemo(() => {
    const ed = window.__stEditor;
    const snap = (ed && typeof ed.getSnapshot === 'function') ? ed.getSnapshot() : null;
    const meta = (snap && snap.meta) || {};
    let plain = typeof meta.plainText === 'string' ? meta.plainText : '';
    let plainAuto = false;
    if (!plain && snap && window.stExport && typeof window.stExport.renderTXT === 'function') {
      try { plain = window.stExport.renderTXT(snap) || ''; plainAuto = true; } catch { plain = ''; }
    }
    return {
      subject: typeof meta.subject === 'string' ? meta.subject : '',
      preview: typeof meta.preview === 'string' ? meta.preview : '',
      plain,
      plainAuto,
      snap,
      vars: (snap && Array.isArray(snap.vars)) ? snap.vars : [],
    };
  }, []);

  const [subject, setSubject] = React.useState(initial.subject);
  const [preview, setPreview] = React.useState(initial.preview);
  const [plain, setPlain] = React.useState(initial.plain);
  const [varPickerOpen, setVarPickerOpen] = React.useState(false);
  const subjectRef = React.useRef(null);

  // Inserts `{{key}}` at cursor position in subject input; appends when blurred.
  const insertVarIntoSubject = (key) => {
    const token = `{{${key}}}`;
    const el = subjectRef.current;
    if (!el) { setSubject(s => s + token); setVarPickerOpen(false); return; }
    const start = typeof el.selectionStart === 'number' ? el.selectionStart : subject.length;
    const end = typeof el.selectionEnd === 'number' ? el.selectionEnd : subject.length;
    const next = subject.slice(0, start) + token + subject.slice(end);
    setSubject(next);
    setVarPickerOpen(false);
    // Place cursor right after inserted token.
    requestAnimationFrame(() => {
      if (!el) return;
      try { el.focus(); el.setSelectionRange(start + token.length, start + token.length); } catch { /* ignore */ }
    });
  };
  // `plainAuto` is true while plain text still matches auto-generated content.
  // It only affects UI hints/save branch and is never persisted.
  const [plainAuto, setPlainAuto] = React.useState(initial.plainAuto);

  const regenerate = () => {
    const ed = window.__stEditor;
    const snap = (ed && typeof ed.getSnapshot === 'function') ? ed.getSnapshot() : initial.snap;
    if (!snap || !window.stExport || typeof window.stExport.renderTXT !== 'function') return;
    try {
      const fresh = window.stExport.renderTXT(snap) || '';
      setPlain(fresh);
      setPlainAuto(true);
    } catch { /* ignore */ }
  };

  const save = async () => {
    const ed = window.__stEditor;
    if (!ed || typeof ed.setMeta !== 'function') { onClose(); return; }
    // Persist exactly what user sees: untouched auto-generated text is accepted,
    // edited text is saved as-is.
    // confirmar el auto-generado — mismo resultado.
    await ed.setMeta({
      subject,
      preview,
      plainText: plain,
    });
    onClose();
  };

  const subjectLen = subject.length;
  const previewLen = preview.length;

  return (
    <Modal
      title={t('modals.details.title')}
      sub={t('modals.details.sub')}
      size="wide"
      onClose={onClose}
      footer={<>
        <button className="btn ghost" onClick={onClose}>{t('modals.common.cancel')}</button>
        <button className="btn primary" onClick={save}><I.check size={13}/> {t('modals.details.save')}</button>
      </>}
    >
      <div className="col" style={{gap:16}}>
        {/* Subject */}
        <div>
          <div className="prop-label" style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <span>{t('modals.details.subject.label')}</span>
            <span style={{fontSize:11,color: subjectLen === 0 ? 'var(--danger)' : subjectLen > 70 ? 'var(--warn)' : 'var(--fg-3)'}}>
              {subjectLen} / 70
            </span>
          </div>
          <div style={{display:'flex',gap:6,position:'relative'}}>
            <input
              ref={subjectRef}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={t('modals.details.subject.placeholder')}
              style={{flex:1,padding:'8px 10px',fontSize:13,border:'1px solid var(--line)',borderRadius:'var(--r-sm)',background:'var(--surface)'}}
            />
            <button
              className="btn sm ghost"
              onClick={() => setVarPickerOpen(v => !v)}
              title={t('modals.details.subject.insertVar')}
              style={{flexShrink:0}}
            >
              <I.braces size={12}/> {t('modals.details.subject.insertVarShort')}
            </button>
            {varPickerOpen && (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position:'absolute',top:'100%',right:0,marginTop:4,
                  background:'var(--surface)',border:'1px solid var(--line)',
                  borderRadius:'var(--r-md)',padding:6,minWidth:220,maxHeight:260,
                  overflow:'auto',zIndex:10,
                  boxShadow:'0 8px 24px -8px rgba(0,0,0,.25)',
                }}
              >
                {initial.vars.length === 0 ? (
                  <div style={{padding:'8px 10px',fontSize:11,color:'var(--fg-3)'}}>
                    {t('modals.details.subject.noVars')}
                  </div>
                ) : initial.vars.map(v => (
                  <button
                    key={v.key}
                    onClick={() => insertVarIntoSubject(v.key)}
                    style={{
                      display:'flex',width:'100%',alignItems:'baseline',gap:8,
                      padding:'6px 8px',border:'none',background:'transparent',
                      textAlign:'left',cursor:'pointer',borderRadius:'var(--r-sm)',
                      fontSize:12,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <code style={{fontSize:11,color:'var(--accent)'}}>{`{{${v.key}}}`}</code>
                    <span style={{color:'var(--fg-3)',fontSize:11,flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {v.label || v.sample || ''}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{fontSize:11,color:'var(--fg-3)',marginTop:4}}>{t('modals.details.subject.hint')}</div>
        </div>

        {/* Preheader */}
        <div>
          <div className="prop-label" style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <span>{t('modals.details.preview.label')}</span>
            <span style={{fontSize:11,color: previewLen === 0 || previewLen > 130 ? 'var(--warn)' : previewLen < 40 ? 'var(--warn)' : 'var(--fg-3)'}}>
              {previewLen} / 90
            </span>
          </div>
          <input
            value={preview}
            onChange={e => setPreview(e.target.value)}
            placeholder={t('modals.details.preview.placeholder')}
            style={{width:'100%',padding:'8px 10px',fontSize:13,border:'1px solid var(--line)',borderRadius:'var(--r-sm)',background:'var(--surface)'}}
          />
          <div style={{fontSize:11,color:'var(--fg-3)',marginTop:4}}>{t('modals.details.preview.hint')}</div>
        </div>

        {/* Plain-text */}
        <div>
          <div className="prop-label" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{t('modals.details.plain.label')}</span>
            <button className="btn sm ghost" onClick={regenerate} title={t('modals.details.plain.regen.tip')}>
              <I.wand size={11}/> {t('modals.details.plain.regen')}
            </button>
          </div>
          <textarea
            value={plain}
            onChange={e => { setPlain(e.target.value); setPlainAuto(false); }}
            rows={12}
            placeholder={t('modals.details.plain.placeholder')}
            style={{width:'100%',padding:'10px 12px',fontSize:12,fontFamily:'var(--font-mono, ui-monospace, monospace)',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',background:'var(--surface)',resize:'vertical',lineHeight:1.5}}
          />
          <div style={{fontSize:11,color:'var(--fg-3)',marginTop:4}}>
            {plainAuto ? t('modals.details.plain.hint.auto') : t('modals.details.plain.hint.edited')}
          </div>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { DetailsModal });
