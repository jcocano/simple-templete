const { ipcMain } = require('electron');
const templates = require('../storage/templates');
const settings = require('../storage/settings');

function register() {
  ipcMain.handle('storage:templates:list', () => templates.list());
  ipcMain.handle('storage:templates:read', (_e, id) => templates.read(id));
  ipcMain.handle('storage:templates:write', (_e, id, doc) => templates.write(id, doc));
  ipcMain.handle('storage:templates:remove', (_e, id) => {
    templates.remove(id);
    return true;
  });
  ipcMain.handle('storage:templates:rename', (_e, id, name) => templates.rename(id, name));
  ipcMain.handle('storage:templates:newId', () => templates.newId());

  ipcMain.handle('storage:settings:get', (_e, key) => settings.get(key));
  ipcMain.handle('storage:settings:set', (_e, key, value) => {
    settings.set(key, value);
    return true;
  });
  ipcMain.handle('storage:settings:remove', (_e, key) => {
    settings.remove(key);
    return true;
  });
  ipcMain.handle('storage:settings:list', () => settings.list());
}

module.exports = { register };
