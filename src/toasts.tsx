// Toast system — API global window.toast({kind, title, msg, action})
// Renderiza una pila en esquina inferior derecha, auto-cierre a los 3.5s

function Toasts() {
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    window.toast = (opts) => {
      const id = Math.random().toString(36).slice(2);
      const t = { id, kind:'ok', title:'', msg:'', action:null, ttl:3500, ...opts };
      setList(l => [...l, t]);
      if (t.ttl > 0) {
        setTimeout(() => setList(l => l.filter(x => x.id !== id)), t.ttl);
      }
      return id;
    };
    window.toast.dismiss = (id) => setList(l => l.filter(x => x.id !== id));
    return () => { delete window.toast; };
  }, []);

  const kindMap = {
    ok:    { bg:'var(--ok)',    icon:'check' },
    info:  { bg:'var(--accent)', icon:'info'  },
    warn:  { bg:'var(--warn)',  icon:'info'  },
    error: { bg:'var(--danger)', icon:'x'     },
    ai:    { bg:'var(--accent)', icon:'sparkles' },
  };

  return (
    <div style={{
      position:'fixed',right:20,bottom:20,zIndex:500,
      display:'flex',flexDirection:'column',gap:8,
      pointerEvents:'none',
    }}>
      {list.map(t => {
        const k = kindMap[t.kind] || kindMap.ok;
        const Ico = I[k.icon] || I.check;
        return (
          <div key={t.id} className="pop" style={{
            minWidth:280,maxWidth:400,
            background:'var(--surface)',
            border:'1px solid var(--line)',
            borderRadius:'var(--r-md)',
            boxShadow:'0 8px 28px -8px rgba(0,0,0,.3)',
            display:'flex',alignItems:'flex-start',gap:10,
            padding:'11px 14px',pointerEvents:'auto',
            borderLeft:`3px solid ${k.bg}`,
          }}>
            <div style={{
              width:22,height:22,borderRadius:6,flexShrink:0,marginTop:1,
              background:`color-mix(in oklab, ${k.bg} 18%, transparent)`,
              color:k.bg,
              display:'grid',placeItems:'center',
            }}>
              <Ico size={12}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              {t.title && <div style={{fontSize:13,fontWeight:500,marginBottom:t.msg?2:0}}>{t.title}</div>}
              {t.msg && <div style={{fontSize:11.5,color:'var(--fg-3)',lineHeight:1.4}}>{t.msg}</div>}
              {t.action && (
                <button className="btn sm" style={{marginTop:8,height:24,fontSize:11.5}} onClick={()=>{ t.action.onClick(); window.toast.dismiss(t.id); }}>
                  {t.action.label}
                </button>
              )}
            </div>
            <button className="btn icon sm ghost" style={{width:20,height:20}} onClick={()=>window.toast.dismiss(t.id)}>
              <I.x size={11}/>
            </button>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { Toasts });
