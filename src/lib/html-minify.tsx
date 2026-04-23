// html-minify.tsx — conservative minifier for email HTML.
// Keeps MSO conditionals and literal blocks intact.

function minifyEmailHtml(html = '') {
  let out = String(html || '');
  const preserved = [];

  function protect(re) {
    out = out.replace(re, (match) => {
      const token = `___ST_MINIFY_${preserved.length}___`;
      preserved.push(match);
      return token;
    });
  }

  // Preserve MSO conditionals and literal blocks where whitespace matters.
  protect(/<!--\s*\[if[\s\S]*?<!\s*\[endif\]\s*-->/gi);
  protect(/<(pre|style|script)\b[\s\S]*?<\/\1>/gi);

  // Strip regular comments after conditionals are protected.
  out = out.replace(/<!--[\s\S]*?-->/g, '');

  // Collapse spacing between tags.
  out = out.replace(/>\s+</g, '><');

  // Collapse text-node whitespace while leaving tags untouched.
  out = out
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (!part || part.startsWith('<')) return part;
      return part.replace(/\s+/g, ' ');
    })
    .join('');

  out = out.trim();

  for (let i = preserved.length - 1; i >= 0; i--) {
    out = out.replace(`___ST_MINIFY_${i}___`, preserved[i]);
  }

  return out;
}

Object.assign(window, {
  minifyEmailHtml,
});
