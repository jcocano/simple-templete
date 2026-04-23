// BlockProps — Panel derecho de propiedades por bloque
// 3 pestañas: Contenido · Estilo · Espaciado
// Soporta todos los tipos de bloque: text, heading, image, icon, button, divider, spacer,
//                                     header, footer, product, social

function BlockProps({ block, onChange, onDelete }) {
  const t = window.stI18n.t;
  window.stI18n.useLang();
  const [tab, setTab] = React.useState('content');
  const [imgOpen, setImgOpen] = React.useState(false);
  const [emojiOpen, setEmojiOpen] = React.useState(false);

  const upd = (path, value) => {
    // path like "style.size" o "content.label" o "spacing.padding"
    // Writes into block.data.{style|content|spacing}
    const keys = path.split('.');
    const next = JSON.parse(JSON.stringify(block));
    next.data = next.data || {};
    let cur = next.data;
    for (let i=0;i<keys.length-1;i++) {
      cur[keys[i]] = cur[keys[i]] || {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length-1]] = value;
    onChange && onChange(next);
  };

  const s = block.data?.style || {};
  // Backward-compat: merge flat data with nested content
  const { style:_s, content:_c, spacing:_sp, ...flat } = (block.data || {});
  const c = { ...flat, ...(block.data?.content || {}) };
  const sp = block.data?.spacing || { padding:[0,0,0,0], margin:[0,0,0,0] };

  const typeLabelMap = {
    text:'blockProps.type.text', heading:'blockProps.type.heading', image:'blockProps.type.image', icon:'blockProps.type.icon',
    button:'blockProps.type.button', divider:'blockProps.type.divider', spacer:'blockProps.type.spacer',
    header:'blockProps.type.header', footer:'blockProps.type.footer', product:'blockProps.type.product',
    social:'blockProps.type.social', hero:'blockProps.type.hero', html:'blockProps.type.html',
  };
  const typeLabel = typeLabelMap[block.type] ? t(typeLabelMap[block.type]) : block.type;

  return (
    <div className="side-body" style={{padding:0}}>
      {/* Header */}
      <div style={{
        padding:'14px 14px 12px',borderBottom:'1px solid var(--line)',
        display:'flex',alignItems:'center',gap:10,
      }}>
        <div style={{
          width:28,height:28,borderRadius:'var(--r-sm)',
          background:'var(--accent-soft)',color:'var(--accent)',
          display:'grid',placeItems:'center',flexShrink:0,
        }}>
          <BlockTypeIcon type={block.type}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:13,fontWeight:600}}>{typeLabel}</div>
          <div style={{fontSize:10.5,color:'var(--fg-3)',fontFamily:'var(--font-mono)'}}>#{block.id}</div>
        </div>
        <button className="btn icon sm ghost" title={t('common.duplicate')}><I.duplicate size={12}/></button>
        {(['text','heading','button','footer','hero'].includes(block.type)) && (
          <button className="btn icon sm ghost" title={t('blockProps.improveAi.tooltip')}
            style={{color:'var(--accent)'}}
            onClick={()=>window.dispatchEvent(new CustomEvent('st:improve', {detail:{block}}))}>
            <I.sparkles size={12}/>
          </button>
        )}
        <button className="btn icon sm ghost" onClick={onDelete} title={t('common.delete')}><I.minus size={13}/></button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',borderBottom:'1px solid var(--line)',padding:'6px 8px 0'}}>
        <PropTab label={t('blockProps.tab.content')} icon="type" active={tab==='content'} onClick={()=>setTab('content')}/>
        <PropTab label={t('blockProps.tab.style')}    icon="paint" active={tab==='style'}   onClick={()=>setTab('style')}/>
        <PropTab label={t('blockProps.tab.spacing')} icon="spacer" active={tab==='spacing'} onClick={()=>setTab('spacing')}/>
      </div>

      {/* Body */}
      <div style={{maxHeight:'calc(100vh - 220px)',overflow:'auto'}}>
        {tab==='content' && <ContentTab block={block} upd={upd}
                              onPickImage={()=>setImgOpen(true)}
                              onPickEmoji={()=>setEmojiOpen(!emojiOpen)}
                              emojiOpen={emojiOpen}/>}
        {tab==='style' && <StyleTab block={block} upd={upd}/>}
        {tab==='spacing' && <SpacingTab block={block} upd={upd}/>}
      </div>

      <ImagePickerModal open={imgOpen} onClose={()=>setImgOpen(false)}
        onSelect={img => {
          // Build a single patched block so both src and alt land in the
          // same dispatch. Two consecutive upd() calls would race — the
          // second one clones from the still-stale `block` prop and
          // overwrites the first (dropping the src).
          const next = JSON.parse(JSON.stringify(block));
          next.data = next.data || {};
          next.data.content = next.data.content || {};
          if (img.url) next.data.content.src = img.url;
          if (img.name) next.data.content.alt = img.alt || img.name;
          onChange && onChange(next);
        }}/>
    </div>
  );
}

function PropTab({ label, icon, active, onClick }) {
  const Ico = I[icon];
  return (
    <button onClick={onClick} style={{
      flex:1,padding:'8px 6px 10px',border:'none',background:'transparent',
      borderBottom: active?'2px solid var(--accent)':'2px solid transparent',
      color: active?'var(--accent)':'var(--fg-2)',
      fontSize:11.5,fontWeight:500,cursor:'pointer',
      display:'flex',alignItems:'center',justifyContent:'center',gap:5,
    }}>
      {Ico && <Ico size={11}/>} {label}
    </button>
  );
}

function BlockTypeIcon({ type }) {
  const map = {
    text:'type', heading:'type', image:'image', icon:'sparkle',
    button:'button', divider:'divider', spacer:'spacer',
    header:'layers', footer:'footer', product:'product',
    social:'heart', hero:'hero', html:'code',
  };
  const Ico = I[map[type] || 'square'];
  return Ico ? <Ico size={14}/> : null;
}

// ═══════════════════════════════════════════════════════════
// TAB: CONTENIDO
// ═══════════════════════════════════════════════════════════
function ContentTab({ block, upd, onPickImage, onPickEmoji, emojiOpen }) {
  const t = window.stI18n.t;
  window.stI18n.useLang();
  const { style:_s, content:_c, spacing:_sp, ...flat } = block.data||{};
  const c = { ...flat, ...(block.data?.content || {}) };
  const bt = block.type;

  if (bt==='text') {
    return (
      <Group title={t('blockProps.type.text')}>
        <Row label={t('blockProps.field.body')}>
          <textarea className="field" rows={5} value={c.body||''}
            onChange={e=>upd('content.body', e.target.value)}
            style={{fontFamily:'inherit',resize:'vertical',padding:8}}
            placeholder={t('blockProps.placeholder.paragraph')}/>
        </Row>
        <Row label={t('blockProps.field.linkColor')}><ColorInput value={block.data?.style?.linkColor||'#5b5bf0'} onChange={v=>upd('style.linkColor',v)}/></Row>
      </Group>
    );
  }

  if (bt==='heading') {
    return (
      <Group title={t('blockProps.type.heading')}>
        <Row label={t('blockProps.field.text')}><input className="field" value={c.text||''} onChange={e=>upd('content.text',e.target.value)}/></Row>
        <Row label={t('blockProps.field.level')}>
          <div className="seg">
            {[1,2,3,4,5,6].map(n => (
              <button key={n} className={(block.data?.style?.level||2)===n?'on':''}
                onClick={()=>upd('style.level',n)}>H{n}</button>
            ))}
          </div>
        </Row>
      </Group>
    );
  }

  if (bt==='image') {
    return (
      <Group title={t('blockProps.type.image')}>
        <Row label={t('blockProps.field.source')}>
          <button className="field" onClick={onPickImage}
            style={{textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
            <I.image size={13}/>
            <span style={{flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis'}}>
              {c.image || t('blockProps.image.pickFromLibrary')}
            </span>
          </button>
        </Row>
        <Row label={t('blockProps.field.altText')}><input className="field" value={c.alt||''} onChange={e=>upd('content.alt',e.target.value)} placeholder={t('blockProps.placeholder.altText')}/></Row>
        <Row label={t('blockProps.field.linkUrl')}><input className="field" value={c.url||''} onChange={e=>upd('content.url',e.target.value)} placeholder="https://…"/></Row>
      </Group>
    );
  }

  if (bt==='icon') {
    const mode = block.data?.style?.mode || 'icon';
    return (
      <>
        <Group title={t('blockProps.tab.content')}>
          <Row label={t('blockProps.field.mode')}>
            <div className="seg">
              <button className={mode==='icon'?'on':''} onClick={()=>upd('style.mode','icon')}>{t('blockProps.icon.modeIconOnly')}</button>
              <button className={mode==='icon-text'?'on':''} onClick={()=>upd('style.mode','icon-text')}>{t('blockProps.icon.modeIconText')}</button>
              <button className={mode==='text'?'on':''} onClick={()=>upd('style.mode','text')}>{t('blockProps.icon.modeTextOnly')}</button>
            </div>
          </Row>
          {mode!=='text' && (
            <Row label={t('blockProps.field.emoji')}>
              <button className="field" onClick={onPickEmoji}
                style={{cursor:'pointer',fontSize:22,padding:'4px 10px',lineHeight:1.4,textAlign:'left'}}>
                {c.emoji || '✨'}
              </button>
            </Row>
          )}
          {emojiOpen && mode!=='text' && (
            <div style={{marginTop:8}}>
              <EmojiPicker onSelect={e => upd('content.emoji', e)}/>
            </div>
          )}
          {mode!=='icon' && (
            <Row label={t('blockProps.field.text')}>
              <input className="field" value={c.text||''} onChange={e=>upd('content.text',e.target.value)} placeholder={t('blockProps.placeholder.label')}/>
            </Row>
          )}
        </Group>
      </>
    );
  }

  if (bt==='button') {
    return (
      <Group title={t('blockProps.type.button')}>
        <Row label={t('blockProps.field.text')}><input className="field" value={c.label||''} onChange={e=>upd('content.label',e.target.value)}/></Row>
        <Row label={t('blockProps.field.url')}><input className="field" value={c.url||''} onChange={e=>upd('content.url',e.target.value)} placeholder="https://…"/></Row>
        <Row label={t('blockProps.field.newTab')}>
          <Toggle value={c.newTab} onChange={v=>upd('content.newTab',v)}/>
        </Row>
      </Group>
    );
  }

  if (bt==='divider') {
    return <Group title={t('blockProps.type.divider')}><div style={{fontSize:12,color:'var(--fg-3)'}}>{t('blockProps.divider.note')}</div></Group>;
  }

  if (bt==='spacer') {
    return <Group title={t('blockProps.type.spacer')}><div style={{fontSize:12,color:'var(--fg-3)'}}>{t('blockProps.spacer.note')}</div></Group>;
  }

  if (bt==='header') {
    return (
      <Group title={t('blockProps.type.header')}>
        <Row label={t('blockProps.field.brand')}><input className="field" value={c.brand||''} onChange={e=>upd('content.brand',e.target.value)}/></Row>
        <Row label={t('blockProps.field.sub')}><input className="field" value={c.sub||''} onChange={e=>upd('content.sub',e.target.value)} placeholder={t('blockProps.placeholder.subHeader')}/></Row>
        <Row label={t('blockProps.field.logo')}>
          <button className="field" onClick={onPickImage}
            style={{textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
            <I.image size={13}/>
            <span style={{flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis'}}>
              {c.logo || t('common.select')}
            </span>
          </button>
        </Row>
      </Group>
    );
  }

  if (bt==='footer') {
    return (
      <Group title={t('blockProps.type.footer')}>
        <Row label={t('blockProps.field.company')}><input className="field" value={c.company||''} onChange={e=>upd('content.company',e.target.value)}/></Row>
        <Row label={t('blockProps.field.notice')}><textarea className="field" rows={2} value={c.notice||''} onChange={e=>upd('content.notice',e.target.value)}/></Row>
        <Row label={t('blockProps.field.unsubUrl')}><input className="field" value={c.unsubUrl||''} onChange={e=>upd('content.unsubUrl',e.target.value)}/></Row>
        <Row label={t('blockProps.field.unsubLabel')}><input className="field" value={c.unsubLabel||''} onChange={e=>upd('content.unsubLabel',e.target.value)}/></Row>
      </Group>
    );
  }

  if (bt==='product') {
    return (
      <Group title={t('blockProps.type.product')}>
        <Row label={t('blockProps.field.name')}><input className="field" value={c.name||''} onChange={e=>upd('content.name',e.target.value)}/></Row>
        <Row label={t('blockProps.field.price')}><input className="field" value={c.price||''} onChange={e=>upd('content.price',e.target.value)}/></Row>
        <Row label={t('blockProps.field.description')}><textarea className="field" rows={2} value={c.desc||''} onChange={e=>upd('content.desc',e.target.value)}/></Row>
        <Row label={t('blockProps.type.image')}>
          <button className="field" onClick={onPickImage} style={{textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
            <I.image size={13}/><span>{c.image || t('common.select')}</span>
          </button>
        </Row>
        <Row label={t('blockProps.field.ctaUrl')}><input className="field" value={c.url||''} onChange={e=>upd('content.url',e.target.value)}/></Row>
      </Group>
    );
  }

  if (bt==='social') {
    const networks = [
      {id:'f', name:'Facebook'},{id:'t', name:'X / Twitter'},{id:'i', name:'Instagram'},
      {id:'in', name:'LinkedIn'},{id:'y', name:'YouTube'},{id:'tt', name:'TikTok'},
      {id:'m', name:'Mastodon'},{id:'th', name:'Threads'},
    ];
    const active = c.active || ['f','t','i','in'];
    const toggle = (id) => {
      const next = active.includes(id) ? active.filter(x=>x!==id) : [...active, id];
      upd('content.active', next);
    };
    return (
      <Group title={t('blockProps.type.social')}>
        {networks.map(n => (
          <Row key={n.id} label={n.name}>
            <Toggle value={active.includes(n.id)} onChange={()=>toggle(n.id)}/>
          </Row>
        ))}
      </Group>
    );
  }

  if (bt==='html') {
    return (
      <Group title={t('blockProps.type.html')}>
        <div style={{fontSize:11.5,color:'var(--fg-3)',lineHeight:1.55,marginBottom:10}}>
          {t('blockProps.html.intro')}
        </div>
        <Row label={t('blockProps.field.htmlCode')}>
          <textarea className="field" rows={10}
            value={c.code||''}
            onChange={e=>upd('content.code',e.target.value)}
            style={{fontFamily:'var(--font-mono)',fontSize:11.5,lineHeight:1.55,resize:'vertical',padding:10,whiteSpace:'pre'}}
            placeholder={'<div style="padding:20px;text-align:center;">\n  Mi HTML personalizado\n</div>'}/>
        </Row>
        <div style={{marginTop:10,padding:10,background:'var(--surface-2)',borderRadius:'var(--r-sm)',fontSize:11,color:'var(--fg-3)',lineHeight:1.5,display:'flex',gap:8}}>
          <span style={{color:'var(--warn, #b45309)',flexShrink:0,marginTop:1}}>⚠</span>
          <span>{t('blockProps.html.warningStart')} <code style={{fontFamily:'var(--font-mono)',fontSize:10.5,background:'var(--surface)',padding:'0 4px',borderRadius:3}}>&lt;script&gt;</code>, <code style={{fontFamily:'var(--font-mono)',fontSize:10.5,background:'var(--surface)',padding:'0 4px',borderRadius:3}}>position:fixed</code> {t('blockProps.html.warningEnd')}</span>
        </div>
      </Group>
    );
  }

  return <Group title={t('blockProps.tab.content')}><div style={{fontSize:12,color:'var(--fg-3)'}}>{t('blockProps.content.none')}</div></Group>;
}

// ═══════════════════════════════════════════════════════════
// TAB: ESTILO
// ═══════════════════════════════════════════════════════════
function StyleTab({ block, upd }) {
  const t = window.stI18n.t;
  window.stI18n.useLang();
  const s = block.data?.style || {};
  const bt = block.type;

  // Tipografía compartida
  const TypoGroup = ({ prefix='', sizeDefault=14, withWeight=true, withAlign=true }) => (
    <Group title={t('blockProps.group.typography')}>
      <Row label={t('blockProps.field.font')}><FontPicker value={s[prefix+'font']||s.font} onChange={v=>upd(`style.${prefix}font`,v)}/></Row>
      <Row label={t('blockProps.field.size')}><Slider value={s[prefix+'size']||sizeDefault} onChange={v=>upd(`style.${prefix}size`,v)} min={8} max={120} suffix="px"/></Row>
      {withWeight && <Row label={t('blockProps.field.weight')}>
        <div className="seg">
          {[400,500,600,700,800].map(w => (
            <button key={w} className={(s[prefix+'weight']||500)===w?'on':''} onClick={()=>upd(`style.${prefix}weight`,w)}>{w}</button>
          ))}
        </div>
      </Row>}
      <Row label={t('blockProps.field.lineHeight')}><Slider value={Math.round((s[prefix+'lh']||1.5)*10)} onChange={v=>upd(`style.${prefix}lh`,v/10)} min={8} max={30} suffix="" /></Row>
      <Row label={t('blockProps.field.tracking')}><Slider value={s[prefix+'tracking']||0} onChange={v=>upd(`style.${prefix}tracking`,v)} min={-4} max={10} suffix="px"/></Row>
      <Row label={t('blockProps.field.color')}><ColorInput value={s[prefix+'color']||'#0b0b0d'} onChange={v=>upd(`style.${prefix}color`,v)}/></Row>
      {withAlign && <Row label={t('blockProps.field.align')}><AlignBar value={s.align||'left'} onChange={v=>upd('style.align',v)}/></Row>}
    </Group>
  );

  if (bt==='text') {
    return (
      <>
        <TypoGroup/>
        <Group title={t('blockProps.group.decoration')}>
          <Row label={t('blockProps.field.italic')}><Toggle value={s.italic} onChange={v=>upd('style.italic',v)}/></Row>
          <Row label={t('blockProps.field.underline')}><Toggle value={s.underline} onChange={v=>upd('style.underline',v)}/></Row>
        </Group>
      </>
    );
  }

  if (bt==='heading') {
    return (
      <>
        <Group title={t('blockProps.group.hierarchy')}>
          <Row label={t('blockProps.field.level')}>
            <div className="seg">
              {[1,2,3,4,5,6].map(n => (
                <button key={n} className={(s.level||2)===n?'on':''} onClick={()=>upd('style.level',n)}>H{n}</button>
              ))}
            </div>
          </Row>
        </Group>
        <TypoGroup sizeDefault={24}/>
      </>
    );
  }

  if (bt==='image') {
    return (
      <>
        <Group title={t('blockProps.group.dimensions')}>
          <Row label={t('blockProps.field.width')}><Slider value={s.width||100} onChange={v=>upd('style.width',v)} min={10} max={100} suffix="%"/></Row>
          <Row label={t('blockProps.field.ratio')}>
            <select className="field" value={s.ratio||'2/1'} onChange={e=>upd('style.ratio',e.target.value)}>
              <option value="1/1">{t('blockProps.ratio.square')}</option>
              <option value="4/3">4:3</option>
              <option value="3/2">3:2</option>
              <option value="16/9">16:9</option>
              <option value="2/1">{t('blockProps.ratio.banner')}</option>
              <option value="3/1">{t('blockProps.ratio.wideHero')}</option>
            </select>
          </Row>
          <Row label={t('blockProps.field.align')}><AlignBar value={s.align||'center'} onChange={v=>upd('style.align',v)} options={['left','center','right']}/></Row>
        </Group>
        <Group title={t('blockProps.group.bordersShadow')}>
          <Row label={t('blockProps.field.radius')}><Slider value={s.radius||0} onChange={v=>upd('style.radius',v)} min={0} max={48} suffix="px"/></Row>
          <Row label={t('blockProps.field.border')}><Slider value={s.border?.w||0} onChange={v=>upd('style.border',{w:v,color:s.border?.color||'#000',style:s.border?.style||'solid'})} min={0} max={10} suffix="px"/></Row>
          <Row label={t('blockProps.field.borderColor')}><ColorInput value={s.border?.color||'#000000'} onChange={v=>upd('style.border',{w:s.border?.w||0,color:v,style:s.border?.style||'solid'})}/></Row>
          <Row label={t('blockProps.field.shadow')}>
            <select className="field" value={s.shadow||'none'} onChange={e=>upd('style.shadow', e.target.value==='none'?null:e.target.value)}>
              <option value="none">{t('blockProps.shadow.none')}</option>
              <option value="0 2px 4px rgba(0,0,0,0.06)">{t('blockProps.shadow.subtle')}</option>
              <option value="0 4px 12px rgba(0,0,0,0.10)">{t('blockProps.shadow.medium')}</option>
              <option value="0 12px 28px rgba(0,0,0,0.18)">{t('blockProps.shadow.strong')}</option>
            </select>
          </Row>
        </Group>
      </>
    );
  }

  if (bt==='icon') {
    return (
      <>
        <Group title={t('blockProps.group.sizeColor')}>
          <Row label={t('blockProps.field.iconSize')}><Slider value={s.size||32} onChange={v=>upd('style.size',v)} min={12} max={120} suffix="px"/></Row>
          <Row label={t('blockProps.field.iconColor')}><ColorInput value={s.color||'#1a1a17'} onChange={v=>upd('style.color',v)}/></Row>
          <Row label={t('blockProps.field.align')}><AlignBar value={s.align||'center'} onChange={v=>upd('style.align',v)} options={['left','center','right']}/></Row>
          <Row label={t('blockProps.field.gap')}><Slider value={s.gap!=null?s.gap:10} onChange={v=>upd('style.gap',v)} min={0} max={40} suffix="px"/></Row>
        </Group>
        <Group title={t('blockProps.group.textIfAny')}>
          <Row label={t('blockProps.field.font')}><FontPicker value={s.font||'inter'} onChange={v=>upd('style.font',v)}/></Row>
          <Row label={t('blockProps.field.size')}><Slider value={s.textSize||14} onChange={v=>upd('style.textSize',v)} min={10} max={40} suffix="px"/></Row>
          <Row label={t('blockProps.field.weight')}>
            <div className="seg">{[400,500,600,700].map(w => (
              <button key={w} className={(s.textWeight||500)===w?'on':''} onClick={()=>upd('style.textWeight',w)}>{w}</button>
            ))}</div>
          </Row>
          <Row label={t('blockProps.field.color')}><ColorInput value={s.textColor||'#0b0b0d'} onChange={v=>upd('style.textColor',v)}/></Row>
        </Group>
      </>
    );
  }

  if (bt==='button') {
    return (
      <>
        <Group title={t('blockProps.group.appearance')}>
          <Row label={t('blockProps.field.background')}><ColorInput value={s.bg||'#1a1a17'} onChange={v=>upd('style.bg',v)}/></Row>
          <Row label={t('blockProps.field.textColor')}><ColorInput value={s.color||'#ffffff'} onChange={v=>upd('style.color',v)}/></Row>
          <Row label={t('blockProps.field.radius')}><Slider value={s.radius!=null?s.radius:4} onChange={v=>upd('style.radius',v)} min={0} max={48} suffix="px"/></Row>
          <Row label={t('blockProps.field.border')}><Slider value={s.borderW||0} onChange={v=>upd('style.borderW',v)} min={0} max={8} suffix="px"/></Row>
          {(s.borderW||0)>0 && <Row label={t('blockProps.field.borderColor')}><ColorInput value={s.borderColor||'#000000'} onChange={v=>upd('style.borderColor',v)}/></Row>}
          <Row label={t('blockProps.field.shadow')}>
            <select className="field" value={s.shadow||'none'} onChange={e=>upd('style.shadow', e.target.value==='none'?null:e.target.value)}>
              <option value="none">{t('blockProps.shadow.none')}</option>
              <option value="0 1px 2px rgba(0,0,0,0.08)">XS</option>
              <option value="0 2px 6px rgba(0,0,0,0.12)">SM</option>
              <option value="0 6px 18px rgba(0,0,0,0.18)">MD</option>
              <option value="0 14px 36px rgba(0,0,0,0.22)">LG</option>
            </select>
          </Row>
        </Group>
        <Group title={t('blockProps.group.typography')}>
          <Row label={t('blockProps.field.font')}><FontPicker value={s.font||'inter'} onChange={v=>upd('style.font',v)}/></Row>
          <Row label={t('blockProps.field.size')}><Slider value={s.size||14} onChange={v=>upd('style.size',v)} min={10} max={28} suffix="px"/></Row>
          <Row label={t('blockProps.field.weight')}>
            <div className="seg">{[400,500,600,700].map(w => (
              <button key={w} className={(s.weight||500)===w?'on':''} onClick={()=>upd('style.weight',w)}>{w}</button>
            ))}</div>
          </Row>
        </Group>
        <Group title={t('blockProps.group.layout')}>
          <Row label={t('blockProps.field.width')}>
            <div className="seg">
              <button className={s.width!=='full'?'on':''} onClick={()=>upd('style.width','auto')}>{t('blockProps.width.auto')}</button>
              <button className={s.width==='full'?'on':''} onClick={()=>upd('style.width','full')}>{t('blockProps.width.full')}</button>
            </div>
          </Row>
          <Row label={t('blockProps.field.align')}><AlignBar value={s.align||'center'} onChange={v=>upd('style.align',v)} options={['left','center','right']}/></Row>
          <Row label={t('blockProps.field.padX')}><Slider value={s.padX||22} onChange={v=>upd('style.padX',v)} min={0} max={80} suffix="px"/></Row>
          <Row label={t('blockProps.field.padY')}><Slider value={s.padY||12} onChange={v=>upd('style.padY',v)} min={0} max={40} suffix="px"/></Row>
        </Group>
      </>
    );
  }

  if (bt==='divider') {
    return (
      <Group title={t('blockProps.type.divider')}>
        <Row label={t('blockProps.tab.style')}>
          <div className="seg">
            <button className={(s.style||'solid')==='solid'?'on':''} onClick={()=>upd('style.style','solid')}>{t('blockProps.divider.solid')}</button>
            <button className={s.style==='dashed'?'on':''} onClick={()=>upd('style.style','dashed')}>{t('blockProps.divider.dashed')}</button>
            <button className={s.style==='dotted'?'on':''} onClick={()=>upd('style.style','dotted')}>{t('blockProps.divider.dotted')}</button>
          </div>
        </Row>
        <Row label={t('blockProps.field.thickness')}><Slider value={s.thickness||1} onChange={v=>upd('style.thickness',v)} min={1} max={12} suffix="px"/></Row>
        <Row label={t('blockProps.field.color')}><ColorInput value={s.color||'#dddbd4'} onChange={v=>upd('style.color',v)}/></Row>
        <Row label={t('blockProps.field.width')}><Slider value={s.width||100} onChange={v=>upd('style.width',v)} min={10} max={100} suffix="%"/></Row>
        <Row label={t('blockProps.field.align')}><AlignBar value={s.align||'center'} onChange={v=>upd('style.align',v)} options={['left','center','right']}/></Row>
      </Group>
    );
  }

  if (bt==='spacer') {
    return (
      <Group title={t('blockProps.type.spacer')}>
        <Row label={t('blockProps.field.height')}><Slider value={s.h||24} onChange={v=>upd('style.h',v)} min={2} max={200} suffix="px"/></Row>
        <Row label={t('blockProps.field.background')}><ColorInput value={s.bg||'transparent'} onChange={v=>upd('style.bg',v)}/></Row>
      </Group>
    );
  }

  if (bt==='header') {
    return (
      <>
        <Group title={t('blockProps.group.layout')}>
          <Row label={t('blockProps.field.arrangement')}>
            <div className="seg">
              <button className={(s.layout||'between')==='between'?'on':''} onClick={()=>upd('style.layout','between')}>{t('blockProps.header.between')}</button>
              <button className={s.layout==='center'?'on':''} onClick={()=>upd('style.layout','center')}>{t('blockProps.header.center')}</button>
            </div>
          </Row>
          <Row label={t('blockProps.field.logoSize')}><Slider value={s.logoSize||18} onChange={v=>upd('style.logoSize',v)} min={12} max={60} suffix="px"/></Row>
        </Group>
        <Group title={t('blockProps.group.colors')}>
          <Row label={t('blockProps.field.brand')}><ColorInput value={s.color||'#0b0b0d'} onChange={v=>upd('style.color',v)}/></Row>
          <Row label={t('blockProps.field.sub')}><ColorInput value={s.subColor||'#6b6a63'} onChange={v=>upd('style.subColor',v)}/></Row>
          <Row label={t('blockProps.field.background')}><ColorInput value={s.bg||'transparent'} onChange={v=>upd('style.bg',v)}/></Row>
        </Group>
        <Group title={t('blockProps.group.typography')}>
          <Row label={t('blockProps.field.font')}><FontPicker value={s.font||'inter'} onChange={v=>upd('style.font',v)}/></Row>
        </Group>
      </>
    );
  }

  if (bt==='footer') {
    return (
      <>
        <Group title={t('blockProps.group.typography')}>
          <Row label={t('blockProps.field.font')}><FontPicker value={s.font||'inter'} onChange={v=>upd('style.font',v)}/></Row>
          <Row label={t('blockProps.field.size')}><Slider value={s.size||12} onChange={v=>upd('style.size',v)} min={9} max={20} suffix="px"/></Row>
          <Row label={t('blockProps.field.color')}><ColorInput value={s.color||'#6b6a63'} onChange={v=>upd('style.color',v)}/></Row>
          <Row label={t('blockProps.field.align')}><AlignBar value={s.align||'center'} onChange={v=>upd('style.align',v)} options={['left','center','right']}/></Row>
        </Group>
        <Group title={t('blockProps.group.background')}>
          <Row label={t('blockProps.field.background')}><ColorInput value={s.bg||'transparent'} onChange={v=>upd('style.bg',v)}/></Row>
        </Group>
      </>
    );
  }

  if (bt==='product') {
    return (
      <>
        <Group title={t('blockProps.group.appearance')}>
          <Row label={t('blockProps.field.background')}><ColorInput value={s.bg||'transparent'} onChange={v=>upd('style.bg',v)}/></Row>
          <Row label={t('blockProps.field.radius')}><Slider value={s.radius||8} onChange={v=>upd('style.radius',v)} min={0} max={40} suffix="px"/></Row>
        </Group>
        <Group title={t('blockProps.group.typography')}>
          <Row label={t('blockProps.field.font')}><FontPicker value={s.font||'inter'} onChange={v=>upd('style.font',v)}/></Row>
          <Row label={t('blockProps.field.nameColor')}><ColorInput value={s.nameColor||'#0b0b0d'} onChange={v=>upd('style.nameColor',v)}/></Row>
          <Row label={t('blockProps.field.priceColor')}><ColorInput value={s.priceColor||'#5b5bf0'} onChange={v=>upd('style.priceColor',v)}/></Row>
        </Group>
      </>
    );
  }

  if (bt==='social') {
    return (
      <>
        <Group title={t('blockProps.group.icons')}>
          <Row label={t('blockProps.field.shape')}>
            <div className="seg">
              <button className={(s.shape||'circle')==='circle'?'on':''} onClick={()=>upd('style.shape','circle')}>{t('blockProps.shape.circle')}</button>
              <button className={s.shape==='square'?'on':''} onClick={()=>upd('style.shape','square')}>{t('blockProps.shape.square')}</button>
            </div>
          </Row>
          <Row label={t('blockProps.field.size')}><Slider value={s.size||28} onChange={v=>upd('style.size',v)} min={16} max={60} suffix="px"/></Row>
          <Row label={t('blockProps.field.color')}><ColorInput value={s.color||'#1a1a17'} onChange={v=>upd('style.color',v)}/></Row>
          <Row label={t('blockProps.field.spacing')}><Slider value={s.gap||12} onChange={v=>upd('style.gap',v)} min={0} max={40} suffix="px"/></Row>
          <Row label={t('blockProps.field.align')}><AlignBar value={s.align||'center'} onChange={v=>upd('style.align',v)} options={['left','center','right']}/></Row>
        </Group>
      </>
    );
  }

  return <Group title={t('blockProps.tab.style')}><div style={{fontSize:12,color:'var(--fg-3)'}}>{t('blockProps.style.none')}</div></Group>;
}

// ═══════════════════════════════════════════════════════════
// TAB: ESPACIADO
// ═══════════════════════════════════════════════════════════
function SpacingTab({ block, upd }) {
  const t = window.stI18n.t;
  window.stI18n.useLang();
  const sp = block.data?.spacing || { padding:[0,0,0,0], margin:[0,0,0,0] };
  const presets = [
    {key:'none',   label:t('blockProps.preset.none'),   p:[0,0,0,0],     m:[0,0,0,0]},
    {key:'compact',label:t('blockProps.preset.compact'),p:[8,12,8,12],   m:[0,0,0,0]},
    {key:'normal', label:t('blockProps.preset.normal'), p:[16,20,16,20], m:[0,0,0,0]},
    {key:'loose',  label:t('blockProps.preset.loose'),  p:[32,28,32,28], m:[12,0,12,0]},
    {key:'section',label:t('blockProps.preset.section'),p:[40,32,40,32], m:[0,0,0,0]},
    {key:'full',   label:t('blockProps.preset.full'),   p:[24,0,24,0],   m:[0,0,0,0]},
  ];
  return (
    <>
      <Group title={t('blockProps.group.paddingInner')}>
        <SpacingBox label={t('blockProps.spacing.padding')} value={sp.padding || [0,0,0,0]} onChange={v=>upd('spacing.padding',v)} max={120}/>
      </Group>
      <Group title={t('blockProps.group.marginOuter')}>
        <SpacingBox label={t('blockProps.spacing.margin')} value={sp.margin || [0,0,0,0]} onChange={v=>upd('spacing.margin',v)} max={120}/>
      </Group>
      <Group title={t('blockProps.group.presets')}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
          {presets.map(preset => (
            <button key={preset.key}
              onClick={()=>{upd('spacing.padding',preset.p); upd('spacing.margin',preset.m);}}
              style={{
                padding:'10px 8px',border:'1px solid var(--line)',
                borderRadius:'var(--r-sm)',background:'var(--surface)',
                cursor:'pointer',fontSize:11.5,textAlign:'left',
                display:'flex',flexDirection:'column',gap:3,
              }}>
              <span style={{fontWeight:500}}>{preset.label}</span>
              <span style={{fontSize:10,color:'var(--fg-3)',fontFamily:'var(--font-mono)'}}>
                p {preset.p[0]}/{preset.p[1]}/{preset.p[2]}/{preset.p[3]}
              </span>
            </button>
          ))}
        </div>
      </Group>
    </>
  );
}

Object.assign(window, { BlockProps });
