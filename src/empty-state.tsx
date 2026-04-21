// EmptyState — componente reusable para estados vacíos
// Usa ilustraciones SVG inline con la paleta del tema (var(--accent), var(--line), etc.)

// ═══════════════════════════════════════════════════════════════
// SVG illustrations — minimal, geometric, ~180x140
// ═══════════════════════════════════════════════════════════════

function IllNoTemplates() {
  // Sobre con puntos animados (plantillas)
  return (
    <svg viewBox="0 0 200 150" width="180" height="135" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fondo decorativo */}
      <circle cx="40" cy="30" r="4" fill="var(--accent-soft)"/>
      <circle cx="170" cy="40" r="3" fill="var(--accent-soft)"/>
      <circle cx="30" cy="120" r="3" fill="var(--accent-soft)"/>
      <circle cx="180" cy="110" r="5" fill="var(--accent-soft)"/>
      {/* Sobre principal */}
      <rect x="45" y="45" width="110" height="72" rx="6" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5"/>
      <path d="M45 50 L100 88 L155 50" stroke="var(--line-2)" strokeWidth="1.5" fill="none"/>
      {/* Líneas internas (mock contenido) */}
      <rect x="60" y="95" width="40" height="3" rx="1.5" fill="var(--line)"/>
      <rect x="60" y="102" width="60" height="3" rx="1.5" fill="var(--line)"/>
      {/* Sparkle acento */}
      <circle cx="145" cy="40" r="10" fill="var(--accent)" opacity="0.15"/>
      <path d="M145 34 L146 38 L150 40 L146 42 L145 46 L144 42 L140 40 L144 38 Z" fill="var(--accent)"/>
    </svg>
  );
}

function IllNoBlocks() {
  // Cuadrícula con un bloque faltante
  return (
    <svg viewBox="0 0 200 150" width="180" height="135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="30" width="40" height="30" rx="4" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5"/>
      <rect x="90" y="30" width="40" height="30" rx="4" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5"/>
      <rect x="140" y="30" width="30" height="30" rx="4" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5"/>
      <rect x="40" y="70" width="40" height="30" rx="4" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5"/>
      {/* Placeholder dashed — bloque faltante */}
      <rect x="90" y="70" width="40" height="30" rx="4" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3"/>
      <path d="M110 80 L110 90 M105 85 L115 85" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="140" y="70" width="30" height="30" rx="4" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5"/>
      <rect x="40" y="110" width="60" height="20" rx="3" fill="var(--line)"/>
      <rect x="110" y="110" width="60" height="20" rx="3" fill="var(--line)"/>
    </svg>
  );
}

function IllNoHistory() {
  // Reloj con agujas
  return (
    <svg viewBox="0 0 200 150" width="180" height="135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="75" r="52" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5"/>
      <circle cx="100" cy="75" r="42" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 4"/>
      {/* Marcas */}
      <line x1="100" y1="28" x2="100" y2="34" stroke="var(--fg-3)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="147" y1="75" x2="141" y2="75" stroke="var(--fg-3)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="100" y1="122" x2="100" y2="116" stroke="var(--fg-3)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="53" y1="75" x2="59" y2="75" stroke="var(--fg-3)" strokeWidth="2" strokeLinecap="round"/>
      {/* Agujas */}
      <line x1="100" y1="75" x2="100" y2="45" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="75" x2="125" y2="85" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="100" cy="75" r="3" fill="var(--accent)"/>
    </svg>
  );
}

function IllSearch() {
  // Lupa sin resultado
  return (
    <svg viewBox="0 0 200 150" width="180" height="135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="85" cy="65" r="32" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="2"/>
      <line x1="108" y1="88" x2="130" y2="110" stroke="var(--line-2)" strokeWidth="4" strokeLinecap="round"/>
      {/* Interrogación dentro */}
      <path d="M78 58 Q78 50 85 50 Q92 50 92 58 Q92 64 85 66 L85 72" stroke="var(--accent)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="85" cy="78" r="1.8" fill="var(--accent)"/>
      {/* Círculos decorativos */}
      <circle cx="150" cy="40" r="3" fill="var(--accent-soft)"/>
      <circle cx="40" cy="100" r="4" fill="var(--accent-soft)"/>
    </svg>
  );
}

function IllEditorEmpty() {
  // Canvas con cursor de inserción
  return (
    <svg viewBox="0 0 200 150" width="180" height="135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="25" width="120" height="100" rx="6" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5"/>
      {/* Drop zone punteada */}
      <rect x="55" y="55" width="90" height="40" rx="4" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4"/>
      {/* Plus en el centro */}
      <circle cx="100" cy="75" r="12" fill="var(--accent)" opacity="0.12"/>
      <path d="M100 68 L100 82 M93 75 L107 75" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
      {/* Mano / cursor */}
      <path d="M155 110 L162 117 L165 114 L160 109 Z" fill="var(--fg-2)"/>
      <path d="M158 115 L163 120" stroke="var(--fg-2)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IllGalleryFilter() {
  // Filtro / embudo
  return (
    <svg viewBox="0 0 200 150" width="180" height="135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M65 35 L135 35 L115 70 L115 115 L85 100 L85 70 Z"
        fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="75" y1="50" x2="125" y2="50" stroke="var(--line)" strokeWidth="1"/>
      {/* Cero / vacío debajo */}
      <circle cx="150" cy="105" r="14" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5"/>
      <line x1="142" y1="97" x2="158" y2="113" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

const ILLUSTRATIONS = {
  'no-templates': IllNoTemplates,
  'no-blocks':    IllNoBlocks,
  'no-history':   IllNoHistory,
  'search':       IllSearch,
  'editor-empty': IllEditorEmpty,
  'gallery':      IllGalleryFilter,
};

// ═══════════════════════════════════════════════════════════════
// EmptyState — composable
// ═══════════════════════════════════════════════════════════════

function EmptyState({
  illustration = 'no-templates',
  title,
  msg,
  primaryAction,   // { label, icon, onClick }
  secondaryAction, // { label, icon, onClick }
  tips = [],       // array de strings
  compact = false, // padding reducido (para inline empty states)
  style = {},
}) {
  const Ill = ILLUSTRATIONS[illustration] || IllNoTemplates;
  return (
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      textAlign:'center',padding: compact ? '28px 24px' : '56px 40px',
      gap:14, maxWidth:420, margin:'0 auto', ...style,
    }}>
      <div style={{marginBottom:4, opacity:0.95}}>
        <Ill/>
      </div>
      {title && (
        <div style={{fontSize: compact?15:18, fontWeight:600, color:'var(--fg)', lineHeight:1.3}}>
          {title}
        </div>
      )}
      {msg && (
        <div style={{fontSize:13, color:'var(--fg-3)', lineHeight:1.55, textWrap:'pretty'}}>
          {msg}
        </div>
      )}
      {(primaryAction || secondaryAction) && (
        <div style={{display:'flex',gap:8,marginTop:6}}>
          {primaryAction && (
            <button className="btn primary" onClick={primaryAction.onClick}>
              {primaryAction.icon && I[primaryAction.icon] && React.createElement(I[primaryAction.icon], {size:13})}
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button className="btn" onClick={secondaryAction.onClick}>
              {secondaryAction.icon && I[secondaryAction.icon] && React.createElement(I[secondaryAction.icon], {size:13})}
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
      {tips.length > 0 && (
        <div style={{
          marginTop:18, padding:'12px 14px',
          background:'var(--surface-2)', border:'1px solid var(--line)',
          borderRadius:'var(--r-sm)', fontSize:11.5, color:'var(--fg-2)',
          textAlign:'left', lineHeight:1.55, width:'100%', maxWidth:360,
        }}>
          <div style={{fontSize:10.5,fontWeight:600,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:0.4,marginBottom:6}}>
            Consejos
          </div>
          {tips.map((t,i)=>(
            <div key={i} style={{display:'flex',gap:8,marginBottom:i<tips.length-1?4:0}}>
              <span style={{color:'var(--accent)',flexShrink:0}}>·</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { EmptyState });
