// Library of saved blocks

function Library({ onBack }) {
  const t = window.stI18n.t;
  window.stI18n.useLang();
  const renderMini = (kind) => {
    const styles = {
      header: <div style={{width:'100%',padding:'10px 14px',background:'#fff',border:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{fontWeight:700,fontSize:11}}>Acme</div><div style={{fontSize:9,color:'#999'}}>Menu</div></div>,
      footer: <div style={{width:'100%',padding:10,background:'#f3f1ea',fontSize:9,color:'#6a6960',textAlign:'center'}}>Acme · CDMX · Desuscribir · Preferencias</div>,
      cta: <div style={{width:'100%',padding:14,background:'#fff',textAlign:'center'}}><div style={{display:'inline-block',padding:'8px 16px',background:'#c6513b',color:'#fff',borderRadius:3,fontSize:10,fontWeight:500}}>Comprar ahora</div></div>,
      testimonial: <div style={{width:'100%',padding:10,background:'#fff',fontStyle:'italic',fontSize:10,color:'#444'}}>"Gran servicio, muy recomendado." <div style={{fontStyle:'normal',color:'#888',fontSize:9,marginTop:4}}>— María G.</div></div>,
      product: <div style={{width:'100%',padding:10,background:'#fff',display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>{[0,1].map(i=><div key={i}><div style={{aspectRatio:'1',background:'#eee',borderRadius:2,marginBottom:4}}/><div style={{fontSize:9}}>Producto {i+1}</div></div>)}</div>,
      social: <div style={{width:'100%',padding:10,background:'#fff',display:'flex',gap:8,justifyContent:'center'}}>{[0,1,2,3].map(i=><div key={i} style={{width:18,height:18,borderRadius:'50%',background:'#1a1a17'}}/>)}</div>,
      signature: <div style={{width:'100%',padding:10,background:'#fff',display:'flex',alignItems:'center',gap:8,fontSize:10}}><div style={{width:24,height:24,borderRadius:'50%',background:'#ddd'}}/><div><div style={{fontWeight:600}}>Carmen Luna</div><div style={{color:'#888',fontSize:9}}>Acme · Fundadora</div></div></div>,
    };
    return styles[kind] || <div>—</div>;
  };
  const [cat, setCat] = React.useState('all');
  const [q, setQ] = React.useState('');

  const CATS = [
    { id:'all',         label: t('library.cat.all') },
    { id:'header',      label: t('library.cat.headers') },
    { id:'footer',      label: t('library.cat.footers') },
    { id:'cta',         label: t('library.cat.ctas') },
    { id:'testimonial', label: t('library.cat.testimonials') },
    { id:'product',     label: t('library.cat.products') },
    { id:'social',      label: t('library.cat.social') },
  ];
  const filtered = SAVED_BLOCKS.filter(b => {
    const matchCat = cat==='all' || b.kind === cat;
    const matchQ = !q.trim() || b.name.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });
  const currentCatLabel = (CATS.find(c => c.id === cat) || CATS[0]).label;

  const countKey = filtered.length === 1 ? 'library.count.one' : 'library.count.other';
  const countText = t(countKey, { n: filtered.length })
    + ((q || cat !== 'all') ? ' ' + t('library.countOf', { total: SAVED_BLOCKS.length }) : '');

  return (
    <div className="editor">
      <div className="editor-top">
        <button className="btn ghost sm" onClick={onBack}><I.chevronL size={14}/> {t('library.back')}</button>
        <div style={{fontFamily:'var(--font-display)',fontSize:15,fontWeight:600,letterSpacing:-0.2}}>{t('library.title')}</div>
        <span className="chip">{countText}</span>
        <div className="grow"/>
        <div className="search">
          <span className="si"><I.search size={14}/></span>
          <input placeholder={t('library.search.placeholder')} value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <ThemeToggleBtn/>
        <button className="btn primary sm" onClick={()=>window.toast && window.toast({kind:'ok', title: t('library.toast.saved.title'), msg: t('library.toast.saved.msg')})}><I.plus size={13}/> {t('library.saveNew')}</button>
      </div>

      <div style={{display:'flex',gap:6,padding:'12px 24px',borderBottom:'1px solid var(--line)',background:'var(--surface)',overflowX:'auto'}}>
        {CATS.map(c => (
          <button key={c.id} className={`btn sm ${c.id===cat?'primary':''}`} onClick={()=>setCat(c.id)}>{c.label}</button>
        ))}
      </div>

      <div className="dash-body">
        {filtered.length === 0 ? (
          <EmptyState
            illustration={q ? 'search' : 'no-blocks'}
            title={q
              ? t('library.empty.search.title', { q })
              : cat==='all'
                ? t('library.empty.none.title')
                : t('library.empty.cat.title', { cat: currentCatLabel })}
            msg={q
              ? t('library.empty.search.msg')
              : cat==='all'
                ? t('library.empty.none.msg')
                : t('library.empty.cat.msg')}
            primaryAction={q
              ? { label: t('library.empty.clearSearch'), icon:'x', onClick:()=>setQ('') }
              : { label: t('library.empty.createNew'), icon:'plus', onClick:()=>window.toast && window.toast({kind:'info', title: t('library.toast.createHint')}) }}
            secondaryAction={cat!=='all' && !q ? { label: t('library.empty.viewAll'), icon:'grid', onClick:()=>setCat('all') } : null}
            tips={!q && cat==='all' ? [
              t('library.tip.available'),
              t('library.tip.vars'),
            ] : []}
          />
        ) : (
          <div className="lib-grid">
            {filtered.map(b => (
              <div key={b.id} className="lib-block">
                <div className="lp">{renderMini(b.kind)}</div>
                <div className="lm">
                  <div className="lt">{b.name}</div>
                  <div className="ls">{t('library.usedIn', { n: b.usedIn })} · <span style={{fontFamily:'var(--font-mono)'}}>&lt;mj-{b.kind}&gt;</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.Library = Library;
