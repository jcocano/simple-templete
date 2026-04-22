const { contextBridge, ipcRenderer } = require('electron');

const invoke = (channel, ...args) => ipcRenderer.invoke(channel, ...args);

contextBridge.exposeInMainWorld('storage', {
  templates: {
    list: () => invoke('storage:templates:list'),
    read: (id) => invoke('storage:templates:read', id),
    write: (id, doc) => invoke('storage:templates:write', id, doc),
    remove: (id) => invoke('storage:templates:remove', id),
    rename: (id, name) => invoke('storage:templates:rename', id, name),
    newId: () => invoke('storage:templates:newId')
  },
  settings: {
    get: (key) => invoke('storage:settings:get', key),
    set: (key, value) => invoke('storage:settings:set', key, value),
    remove: (key) => invoke('storage:settings:remove', key),
    list: () => invoke('storage:settings:list')
  }
});

contextBridge.exposeInMainWorld('secrets', {
  get: (key) => invoke('secrets:get', key),
  set: (key, value) => invoke('secrets:set', key, value),
  remove: (key) => invoke('secrets:remove', key),
  backend: () => invoke('secrets:backend')
});
