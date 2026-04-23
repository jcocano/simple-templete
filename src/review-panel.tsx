// Pre-flight Review Panel — checklist antes de enviar
// Se abre como panel lateral derecho desde el editor o el command palette

function ReviewPanel({ onClose, onGoSettings }) {
  const t = window.stI18n.t;
  const lang = window.stI18n.useLang();
  const [running, setRunning] = React.useState(true);
  const [results, setResults] = React.useState([]);
  const [fixed, setFixed] = React.useState({});

  // Translate each check's static labels using the active language. Rebuild
  // when `lang` changes so the panel reflects language switches while open.
  const translated = React.useMemo(() => {
    return results.map(r => ({
      ...r,
      cat:    t(`review.cat.${r.cat}`),
      title:  t(`review.check.${r.id}.title`),
      detail: t(`review.check.${r.id}.detail`),
      fixes:  r.fixes ? r.fixes.map((f, i) => ({ ...f, label: t(`review.check.${r.id}.fix.${i}`) })) : null,
    }));
  }, [results, lang]);

  React.useEffect(() => {
    // Simula análisis progresivo
    const checks = ALL_CHECKS;
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i >= checks.length) {
        setRunning(false);
        return;
      }
      const item = checks[i];
      i++;
      if (item) setResults(r => [...r, item]);
      setTimeout(tick, 140);
    };
    const id = setTimeout(tick, 140);
    return () => { cancelled = true; clearTimeout(id); };
  }, []);

  const summary = React.useMemo(() => {
    const s = { ok:0, warn:0, error:0, info:0 };
    translated.forEach(r => { if (!fixed[r.id]) s[r.kind] = (s[r.kind]||0) + 1; else s.ok++; });
    return s;
  }, [translated, fixed]);

  const grouped = React.useMemo(() => {
    const g = {};
    translated.forEach(r => { (g[r.cat] = g[r.cat] || []).push(r); });
    return g;
  }, [translated]);

  const score = translated.length === 0 ? 0 :
    Math.round(((translated.filter(r=>r.kind==='ok'||fixed[r.id]).length) / translated.length) * 100);

  const markFixed = (id) => {
    setFixed(f => ({...f, [id]:true}));
    window.toast && window.toast({ kind:'ok', title: t('review.toast.fixed.title'), msg: t('review.toast.fixed.msg') });
  };

  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,background:'rgba(0,0,0,.35)',
      zIndex:100,backdropFilter:'blur(4px)',
      display:'flex',justifyContent:'flex-end',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'min(480px, 100vw)',height:'100vh',
        background:'var(--surface)',
        borderLeft:'1px solid var(--line)',
        boxShadow:'-12px 0 40px -12px rgba(0,0,0,.3)',
        display:'flex',flexDirection:'column',
      }}>
        {/* Head */}
        <div style={{padding:'18px 22px 14px',borderBottom:'1px solid var(--line)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
            <div style={{
              width:30,height:30,borderRadius:8,
              background:'var(--accent)',color:'#fff',
              display:'grid',placeItems:'center',
            }}><I.eye size={15}/></div>
            <div style={{flex:1}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:600,fontFamily:'var(--font-display)'}}>{t('review.title')}</h3>
              <div style={{fontSize:11.5,color:'var(--fg-3)',marginTop:2}}>{t('review.subtitle')}</div>
            </div>
            <button className="btn icon ghost" onClick={onClose}><I.x size={14}/></button>
          </div>

          {/* Score bar */}
          <div style={{
            marginTop:14,padding:'12px 14px',
            background:'var(--surface-2)',
            borderRadius:'var(--r-md)',
          }}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <div style={{
                fontSize:22,fontWeight:600,
                color: score >= 90 ? 'var(--ok)' : score >= 70 ? 'var(--warn)' : 'var(--danger)',
                fontFamily:'var(--font-display)',
              }}>{score}<span style={{fontSize:14,color:'var(--fg-3)'}}>/100</span></div>
              <div style={{flex:1}}>
                <div style={{fontSize:12.5,fontWeight:500}}>
                  {running ? t('review.analyzing') : score >= 90 ? t('review.score.ready') : score >= 70 ? t('review.score.suggestions') : t('review.score.problems')}
                </div>
                <div style={{fontSize:11,color:'var(--fg-3)'}}>
                  {t('review.summary', { total: translated.length, ok: summary.ok, warn: summary.warn, error: summary.error })}
                </div>
              </div>
            </div>
            <div style={{height:6,borderRadius:3,background:'var(--surface)',overflow:'hidden'}}>
              <div style={{
                height:'100%',width:`${score}%`,
                background: score >= 90 ? 'var(--ok)' : score >= 70 ? 'var(--warn)' : 'var(--danger)',
                transition:'width 300ms, background 200ms',
              }}/>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div style={{flex:1,overflow:'auto',padding:'14px 22px 20px'}}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{marginBottom:20}}>
              <div style={{
                fontSize:10.5,fontWeight:600,color:'var(--fg-3)',
                textTransform:'uppercase',letterSpacing:'.06em',
                marginBottom:8,
              }}>{cat}</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {items.map(r => (
                  <ReviewItem key={r.id} r={r} fixed={!!fixed[r.id]} onFix={()=>markFixed(r.id)} onGoSettings={onGoSettings}/>
                ))}
              </div>
            </div>
          ))}
          {running && (
            <div style={{padding:'10px 14px',fontSize:12,color:'var(--fg-3)',display:'flex',alignItems:'center',gap:8}}>
              <div className="spinner" style={{width:12,height:12,border:'2px solid var(--line)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
              {t('review.analyzingFull')}
            </div>
          )}
        </div>

        {/* Foot */}
        <div style={{
          padding:'14px 22px',borderTop:'1px solid var(--line)',
          background:'var(--surface-2)',
          display:'flex',gap:8,alignItems:'center',
        }}>
          <div style={{flex:1,fontSize:11,color:'var(--fg-3)'}}>
            {running ? t('review.analyzing') : summary.error > 0 ? t('review.foot.fixFirst') : t('review.foot.goodToGo')}
          </div>
          <button className="btn" onClick={onClose}>{t('review.close')}</button>
          <button className="btn primary" disabled={running || summary.error > 0}>
            <I.send size={12}/> {t('review.sendTest')}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } } @keyframes slideInRight { from { transform:translateX(100%); } to { transform:none; } }`}</style>
    </div>
  );
}

function ReviewItem({ r, fixed, onFix, onGoSettings }) {
  const t = window.stI18n.t;
  window.stI18n.useLang();
  const [expanded, setExpanded] = React.useState(r.kind === 'error');
  const kindColor = fixed ? 'var(--ok)' : r.kind === 'ok' ? 'var(--ok)' : r.kind === 'warn' ? 'var(--warn)' : r.kind === 'error' ? 'var(--danger)' : 'var(--fg-3)';
  const kindIco = fixed ? I.check : r.kind === 'ok' ? I.check : r.kind === 'warn' ? I.info : r.kind === 'error' ? I.x : I.info;
  const Ico = kindIco;
  return (
    <div style={{
      border:'1px solid var(--line)',borderRadius:'var(--r-md)',
      overflow:'hidden',background:'var(--surface)',
      borderLeft: `3px solid ${kindColor}`,
    }}>
      <div onClick={()=>setExpanded(e=>!e)} style={{
        display:'flex',alignItems:'center',gap:10,
        padding:'10px 12px',cursor:'pointer',
      }}>
        <div style={{
          width:20,height:20,borderRadius:'50%',flexShrink:0,
          background: `color-mix(in oklab, ${kindColor} 18%, transparent)`,
          color:kindColor,
          display:'grid',placeItems:'center',
        }}><Ico size={10}/></div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:500,color: fixed ? 'var(--fg-3)' : 'var(--fg)',textDecoration: fixed?'line-through':'none'}}>{r.title}</div>
          {!expanded && r.detail && <div style={{fontSize:11,color:'var(--fg-3)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.detail}</div>}
        </div>
        <I.chevronD size={12} style={{color:'var(--fg-3)',transform:expanded?'rotate(180deg)':'none',transition:'transform 150ms'}}/>
      </div>
      {expanded && (
        <div style={{padding:'0 12px 12px',fontSize:11.5,color:'var(--fg-2)',lineHeight:1.5}}>
          {r.detail && <div style={{marginBottom:r.fixes?8:0}}>{r.detail}</div>}
          {r.fixes && !fixed && (
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>
              {r.fixes.map((f,i) => (
                <button key={i} className="btn sm" onClick={()=>{ f.goSettings ? onGoSettings(f.goSettings) : onFix(); }}>
                  {f.label}
                </button>
              ))}
            </div>
          )}
          {fixed && <div style={{color:'var(--ok)',fontSize:11,marginTop:4}}>✓ {t('review.fixed')}</div>}
        </div>
      )}
    </div>
  );
}

// Mock checks — cubre categorías reales de email marketing.
// Fields `cat`, `title`, `detail`, and `fixes[i].label` are translation-keyed:
// the component replaces them via `review.cat.<cat>`, `review.check.<id>.title`, etc.
const ALL_CHECKS = [
  // Contenido
  { id:'c1', cat:'content',       kind:'ok',    fixes:null },
  { id:'c2', cat:'content',       kind:'warn',  fixes:[{},{}] },
  { id:'c3', cat:'content',       kind:'ok',    fixes:null },
  { id:'c4', cat:'content',       kind:'error', fixes:[{}, { goSettings:'vars' }] },
  { id:'c5', cat:'content',       kind:'ok',    fixes:null },

  // Accesibilidad
  { id:'a1', cat:'a11y',          kind:'error', fixes:[{},{}] },
  { id:'a2', cat:'a11y',          kind:'warn',  fixes:[{},{}] },
  { id:'a3', cat:'a11y',          kind:'ok',    fixes:null },
  { id:'a4', cat:'a11y',          kind:'ok',    fixes:null },

  // Compatibilidad
  { id:'k1', cat:'compat',        kind:'warn',  fixes:[{},{}] },
  { id:'k2', cat:'compat',        kind:'ok',    fixes:null },
  { id:'k3', cat:'compat',        kind:'ok',    fixes:null },
  { id:'k4', cat:'compat',        kind:'info',  fixes:null },

  // Imágenes y pesos
  { id:'i1', cat:'images',        kind:'warn',  fixes:[{}] },
  { id:'i2', cat:'images',        kind:'ok',    fixes:null },

  // Enlaces
  { id:'l1', cat:'links',         kind:'ok',    fixes:null },
  { id:'l2', cat:'links',         kind:'ok',    fixes:null },

  // Legal y entrega
  { id:'g1', cat:'legal',         kind:'ok',    fixes:null },
  { id:'g2', cat:'legal',         kind:'ok',    fixes:null },
  { id:'g3', cat:'legal',         kind:'warn',  fixes:[{}] },
  { id:'g4', cat:'legal',         kind:'info',  fixes:null },
];

Object.assign(window, { ReviewPanel });
