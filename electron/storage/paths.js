const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const userDataDir = () => app.getPath('userData');
const templatesDir = () => path.join(userDataDir(), 'templates');
const workspaceTemplatesDir = (workspaceId) => path.join(templatesDir(), workspaceId);
const savedBlocksDir = () => path.join(userDataDir(), 'saved-blocks');
const workspaceSavedBlocksDir = (workspaceId) => path.join(savedBlocksDir(), workspaceId);
const workspacesDir = () => path.join(userDataDir(), 'workspaces');
const workspaceImagesDir = (workspaceId) => path.join(workspacesDir(), workspaceId, 'images');
const dbPath = () => path.join(userDataDir(), 'app.db');

function ensureDirs(workspaceId) {
  fs.mkdirSync(templatesDir(), { recursive: true });
  fs.mkdirSync(savedBlocksDir(), { recursive: true });
  if (workspaceId) {
    fs.mkdirSync(workspaceTemplatesDir(workspaceId), { recursive: true });
    fs.mkdirSync(workspaceSavedBlocksDir(workspaceId), { recursive: true });
  }
}

function ensureImagesDir(workspaceId) {
  if (!workspaceId) return;
  fs.mkdirSync(workspaceImagesDir(workspaceId), { recursive: true });
}

module.exports = {
  userDataDir,
  templatesDir,
  workspaceTemplatesDir,
  savedBlocksDir,
  workspaceSavedBlocksDir,
  workspacesDir,
  workspaceImagesDir,
  dbPath,
  ensureDirs,
  ensureImagesDir,
};
