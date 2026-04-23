// Command Palette — atajo ⌘K / Ctrl+K
// API: window.dispatchEvent(new CustomEvent('st:cmd-open'))
// Comandos registrados desde fuera vía window.registerCommands([...])

function CommandPalette({ onNavigate, onClose }) {
  const t = window.stI18n.t;
  const lang = window.stI18n.useLang();
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);

  // Auto-focus on mount
  React.useEffect(() => {
    setQ(''); setSel(0);
    setTimeout(() => inputRef.current?.focus(), 20);
    const keyH = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', keyH);
    return () => window.removeEventListener('keydown', keyH);
  }, []);

  // Comandos — construidos desde data y navegación
  const cmds = React.useMemo(() => {
    const TEMPLATES = window.TEMPLATES || [];
    const BLOCK_CATALOG = window.BLOCK_CATALOG || [];
    const gA = t('cmd.group.actions');
    const gG = t('cmd.group.goto');
    const gS = t('cmd.group.settings');
    const gT = t('cmd.group.appearance');
    const base = [
      // Quick actions
      { id:'new',     t:t('cmd.new'),          s:t('cmd.new.sub'),          g:gA, icon:'plus',      run:()=>onNavigate('gallery') },
      { id:'ai-gen',  t:t('cmd.ai'),           s:t('cmd.ai.sub'),           g:gA, icon:'sparkles',  run:()=>onNavigate('ai-generate') },
      { id:'review',  t:t('cmd.review'),       s:t('cmd.review.sub'),       g:gA, icon:'eye',       run:()=>onNavigate('review') },
      { id:'export',  t:t('cmd.export'),       s:t('cmd.export.sub'),       g:gA, icon:'send',      run:()=>onNavigate('export') },
      { id:'vars',    t:t('cmd.vars'),         s:t('cmd.vars.sub'),         g:gA, icon:'braces',    run:()=>onNavigate('vars') },
      // Navigation
      { id:'n-dash',  t:t('cmd.goto.dash'),    s:t('cmd.goto.dash.sub'),    g:gG, icon:'grid',      run:()=>onNavigate('dashboard') },
      { id:'n-gal',   t:t('cmd.goto.gallery'), s:t('cmd.goto.gallery.sub'), g:gG, icon:'layers',    run:()=>onNavigate('gallery') },
      { id:'n-lib',   t:t('cmd.goto.library'), s:t('cmd.goto.library.sub'), g:gG, icon:'folder',    run:()=>onNavigate('library') },
      { id:'n-img',   t:t('cmd.goto.images'),  s:t('cmd.goto.images.sub'),  g:gG, icon:'image',     run:()=>onNavigate('images') },
      { id:'n-prev',  t:t('cmd.goto.preview'), s:t('cmd.goto.preview.sub'), g:gG, icon:'eye',       run:()=>onNavigate('preview') },
      // Settings
      { id:'s-all',   t:t('cmd.settings.all'),      s:t('cmd.settings.all.sub'),      g:gS, icon:'settings', run:()=>onNavigate('settings') },
      { id:'s-ai',    t:t('cmd.settings.ai'),       s:t('cmd.settings.ai.sub'),       g:gS, icon:'sparkles', run:()=>onNavigate('settings:ai') },
      { id:'s-brand', t:t('cmd.settings.brand'),    s:t('cmd.settings.brand.sub'),    g:gS, icon:'palette',  run:()=>onNavigate('settings:brand') },
      { id:'s-store', t:t('cmd.settings.storage'),  s:t('cmd.settings.storage.sub'),  g:gS, icon:'image',    run:()=>onNavigate('settings:storage') },
      { id:'s-deli',  t:t('cmd.settings.delivery'), s:t('cmd.settings.delivery.sub'), g:gS, icon:'send',     run:()=>onNavigate('settings:delivery') },
      // Theme
      { id:'theme-t', t:t('cmd.theme.toggle'), s:t('cmd.theme.toggle.sub'), g:gT, icon:'sun',  run:()=>onNavigate('theme:toggle') },
      { id:'theme-l', t:t('cmd.theme.light'),  s:t('cmd.theme.light.sub'),  g:gT, icon:'sun',  run:()=>onNavigate('theme:light') },
      { id:'theme-d', t:t('cmd.theme.dark'),   s:t('cmd.theme.dark.sub'),   g:gT, icon:'moon', run:()=>onNavigate('theme:dark') },
    ];
    const gTpl = t('cmd.group.templates');
    const gBlk = t('cmd.group.blocks');
    // Real templates
    const tpls = TEMPLATES.slice(0, 20).map(tp => ({
      id:'t-'+tp.id, t:tp.name, s:t('cmd.tpl.item', {folder: tp.folder}), g:gTpl, icon:'mail',
      run:()=>onNavigate('template:'+tp.id, tp)
    }));
    // Catalog blocks
    const blocks = BLOCK_CATALOG.slice(0, 15).map(b => ({
      id:'b-'+b.type, t:t('cmd.block.insert', {name: b.name}), s:t('cmd.block.type', {type: b.type}), g:gBlk, icon:b.icon||'grid',
      run:()=>onNavigate('insert:'+b.type)
    }));
    return [...base, ...tpls, ...blocks];
  }, [onNavigate, lang]);

  const filtered = React.useMemo(() => {
    if (!q.trim()) return cmds;
    const needle = q.toLowerCase();
    return cmds.filter(c => c.t.toLowerCase().includes(needle) || (c.s||'').toLowerCase().includes(needle) || c.g.toLowerCase().includes(needle));
  }, [q, cmds]);

  const grouped = React.useMemo(() => {
    const g = {};
    filtered.forEach(c => { (g[c.g] = g[c.g] || []).push(c); });
    return g;
  }, [filtered]);

  const flat = filtered;

  React.useEffect(() => { setSel(0); }, [q]);

  const runAt = (idx) => {
    const c = flat[idx];
    if (!c) return;
    c.run();
    onClose();
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s+1, flat.length-1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); runAt(sel); }
  };

  if (!flat) return null;

  let runIdx = -1;
  return (
    <div className="modal-backdrop" onClick={onClose} style={{alignItems:'flex-start',paddingTop:'12vh',background:'rgba(0,0,0,.35)'}}>
      <div className="pop" onClick={e=>e.stopPropagation()} style={{
        width:'min(640px, calc(100vw - 48px))',
        background:'var(--surface)',
        borderRadius:'var(--r-lg)',
        border:'1px solid var(--line)',
        boxShadow:'0 24px 80px -20px rgba(0,0,0,.4)',
        overflow:'hidden',
        display:'flex',flexDirection:'column',
        maxHeight:'70vh',
      }}>
        <div style={{
          display:'flex',alignItems:'center',gap:10,
          padding:'14px 18px',borderBottom:'1px solid var(--line)',
        }}>
          <I.search size={15} style={{color:'var(--fg-3)'}}/>
          <input
            ref={inputRef}
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder={t('cmd.placeholder')}
            style={{
              flex:1,background:'transparent',border:'none',outline:'none',
              fontSize:15,color:'var(--fg)',
            }}
          />
          <span className="kbd" style={{fontSize:10.5}}>esc</span>
        </div>

        <div style={{flex:1,overflow:'auto',padding:'6px 0'}}>
          {flat.length === 0 && (
            <EmptyState
              illustration="search"
              title={t('cmd.empty.title', {q})}
              msg={t('cmd.empty.msg')}
              compact
              tips={[
                t('cmd.tip.tab'),
                t('cmd.tip.esc'),
              ]}
            />
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} style={{marginBottom:6}}>
              <div style={{
                padding:'8px 18px 4px',fontSize:10.5,color:'var(--fg-3)',
                textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600,
              }}>{group}</div>
              {items.map(c => {
                runIdx++;
                const isSel = runIdx === sel;
                const Ico = I[c.icon] || I.chevronR;
                const myIdx = runIdx;
                return (
                  <div key={c.id}
                    onMouseEnter={()=>setSel(myIdx)}
                    onClick={()=>runAt(myIdx)}
                    style={{
                      display:'flex',alignItems:'center',gap:12,
                      padding:'8px 18px',cursor:'pointer',
                      background: isSel ? 'var(--accent-soft)' : 'transparent',
                      color: isSel ? 'var(--accent)' : 'var(--fg)',
                    }}>
                    <div style={{
                      width:26,height:26,borderRadius:6,flexShrink:0,
                      background: isSel ? 'color-mix(in oklab, var(--accent) 15%, transparent)' : 'var(--surface-2)',
                      display:'grid',placeItems:'center',color:'currentColor',
                    }}>
                      <Ico size={13}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:isSel?500:400,color:isSel?'var(--accent)':'var(--fg)'}}>{c.t}</div>
                      {c.s && <div style={{fontSize:11,color:'var(--fg-3)',marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.s}</div>}
                    </div>
                    {isSel && <span className="kbd" style={{fontSize:10}}>↵</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{
          padding:'8px 18px',borderTop:'1px solid var(--line)',background:'var(--surface-2)',
          display:'flex',alignItems:'center',gap:14,fontSize:11,color:'var(--fg-3)',
        }}>
          <span style={{display:'flex',alignItems:'center',gap:4}}><span className="kbd" style={{fontSize:10}}>↑↓</span> {t('cmd.foot.nav')}</span>
          <span style={{display:'flex',alignItems:'center',gap:4}}><span className="kbd" style={{fontSize:10}}>↵</span> {t('cmd.foot.exec')}</span>
          <span style={{display:'flex',alignItems:'center',gap:4}}><span className="kbd" style={{fontSize:10}}>esc</span> {t('cmd.foot.close')}</span>
          <div style={{flex:1}}/>
          <span>{t(flat.length===1 ? 'cmd.foot.count.one' : 'cmd.foot.count.other', {n: flat.length})}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CommandPalette });
