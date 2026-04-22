const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const userDataDir = () => app.getPath('userData');
const templatesDir = () => path.join(userDataDir(), 'templates');
const dbPath = () => path.join(userDataDir(), 'app.db');

function ensureDirs() {
  fs.mkdirSync(templatesDir(), { recursive: true });
}

module.exports = { userDataDir, templatesDir, dbPath, ensureDirs };
