// MCP facade + status hook. Bridges preload-exposed window.mcp to browser
// CustomEvents so components can listen without coupling to the preload API.
//
// Events emitted on window:
//   - st:mcp-activity            {state, workspaceId, templateId}
//   - st:template-change-external {workspaceId, templateId, source, event}
//   - st:mcp-open-template        {workspaceId, templateId}

(function bootstrap() {
  if (!window.mcp) {
    console.warn('[stMCP] window.mcp bridge not available');
    return;
  }
  try {
    window.mcp.onActivity((detail) => {
      window.dispatchEvent(new CustomEvent('st:mcp-activity', { detail }));
    });
    window.mcp.onExternalChange((detail) => {
      window.dispatchEvent(new CustomEvent('st:template-change-external', { detail }));
      // Also re-dispatch as a normal template-change so existing UI that lists
      // templates (useTemplates, useTrashedTemplates, dashboard, library, etc.)
      // refreshes on agent-driven mutations without knowing about MCP at all.
      const event = (detail && detail.event) || 'update';
      if (event === 'open') return;
      const kind = event === 'delete' ? 'delete' : event === 'create' ? 'create' : 'update';
      window.dispatchEvent(new CustomEvent('st:template-change', {
        detail: { id: detail && detail.templateId, kind },
      }));
    });
    window.mcp.onOpenTemplate((detail) => {
      window.dispatchEvent(new CustomEvent('st:mcp-open-template', { detail }));
    });
  } catch (err) {
    console.error('[stMCP] bootstrap failed', err);
  }
})();

async function status() {
  if (!window.mcp) return { enabled: false, running: false, port: null, token: null, url: null };
  return window.mcp.status();
}

async function setEnabled(enabled) {
  if (!window.mcp) return null;
  return window.mcp.setEnabled(!!enabled);
}

async function setPort(port) {
  if (!window.mcp) return null;
  return window.mcp.setPort(port);
}

async function rotateToken() {
  if (!window.mcp) return null;
  return window.mcp.rotateToken();
}

async function forceRelease() {
  if (!window.mcp) return null;
  return window.mcp.forceRelease();
}

function onActivity(cb) {
  const h = (e) => { try { cb(e.detail); } catch (err) { console.error('[stMCP] onActivity cb', err); } };
  window.addEventListener('st:mcp-activity', h);
  return () => window.removeEventListener('st:mcp-activity', h);
}

function onExternalChange(cb) {
  const h = (e) => { try { cb(e.detail); } catch (err) { console.error('[stMCP] onExternalChange cb', err); } };
  window.addEventListener('st:template-change-external', h);
  return () => window.removeEventListener('st:template-change-external', h);
}

function onOpenTemplate(cb) {
  const h = (e) => { try { cb(e.detail); } catch (err) { console.error('[stMCP] onOpenTemplate cb', err); } };
  window.addEventListener('st:mcp-open-template', h);
  return () => window.removeEventListener('st:mcp-open-template', h);
}

// React hook: subscribes to status changes (polled on activity + external-change) and returns current status.
function useMCPStatus() {
  const [s, setS] = React.useState({ enabled: false, running: false, port: null, token: null, url: null });
  React.useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const next = await status();
      if (alive) setS(next);
    };
    refresh();
    const onChange = () => refresh();
    window.addEventListener('st:mcp-activity', onChange);
    window.addEventListener('st:settings-change', onChange);
    return () => {
      alive = false;
      window.removeEventListener('st:mcp-activity', onChange);
      window.removeEventListener('st:settings-change', onChange);
    };
  }, []);
  return s;
}

const stMCP = {
  status, setEnabled, setPort, rotateToken, forceRelease,
  onActivity, onExternalChange, onOpenTemplate,
};

Object.assign(window, { stMCP, useMCPStatus });
