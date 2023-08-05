import path from 'path';
import { BrowserWindow, app } from 'electron';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 1080,
    x: 99999,
    y: 0,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadFile('dist/index.html');
  // mainWindow.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  createWindow();
});

app.once('window-all-closed', () => app.quit());
