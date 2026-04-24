// Brand mark — the app icon from /assets/icon.svg, inlined so Vite
// doesn't need to serve it as a static asset. Kept identical in shape
// to the source SVG so packaged icons and in-app branding stay visually in sync.
function BrandIcon({ size = 26, className, style }) {
  const gradId = React.useId();
  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      shapeRendering="geometricPrecision"
      className={className}
      style={{flexShrink:0, ...style}}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B82F6"/>
          <stop offset="1" stopColor="#2563EB"/>
        </linearGradient>
      </defs>
      <rect x="128" y="368" width="768" height="488" rx="40" ry="40" fill={`url(#${gradId})`}/>
      <g>
        <rect x="232" y="152" width="560" height="520" rx="28" ry="28" fill="#FFFFFF"/>
        <rect x="280" y="208" width="464" height="80" rx="14" ry="14" fill="#3B82F6"/>
        <rect x="280" y="328" width="180" height="160" rx="14" ry="14" fill="#DBEAFE"/>
        <rect x="488" y="340" width="256" height="16" rx="8" ry="8" fill="#E5E7EB"/>
        <rect x="488" y="372" width="220" height="16" rx="8" ry="8" fill="#E5E7EB"/>
        <rect x="488" y="404" width="180" height="16" rx="8" ry="8" fill="#E5E7EB"/>
        <rect x="488" y="436" width="140" height="16" rx="8" ry="8" fill="#EEF0F3"/>
        <rect x="280" y="516" width="400" height="16" rx="8" ry="8" fill="#E5E7EB"/>
        <rect x="280" y="548" width="340" height="16" rx="8" ry="8" fill="#EEF0F3"/>
      </g>
      <path d="M 128 408 L 512 720 L 896 408 L 896 816 Q 896 856 856 856 L 168 856 Q 128 856 128 816 Z" fill={`url(#${gradId})`}/>
      <path d="M 128 408 L 512 720 L 896 408" fill="none" stroke="#1E40AF" strokeWidth="6" strokeLinejoin="round" opacity="0.45"/>
    </svg>
  );
}

Object.assign(window, { BrandIcon });
