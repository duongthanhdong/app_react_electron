const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

const { setup: setupPushReceiver } = require('electron-push-receiver');



let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 770, height: 1000 , webPreferences: {
    nodeIntegration: true
  }});
  // mainWindow.setMenu(null)
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  // if (isDev) {
  //   // Open the DevTools.
  //   //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
  //   mainWindow.webContents.openDevTools();
  // }
  mainWindow.on('closed', () => mainWindow = null);
  // Call it before 'did-finish-load' with mainWindow a reference to your window
  setupPushReceiver(mainWindow.webContents);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
