// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.on('closed', () => {
    app.quit();
  });

});

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 200,
    height: 200,
    title: 'Add Shopping Item',
    webPreferences: {
      nodeIntegration: true
    }
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
}

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click: () => {
          createAddWindow();
          // addWindow.on('close', () => {
          //   addWindow = null;
          // })
          ipcMain.on('item:add', (e, item) => {
            mainWindow.webContents.send('item:add', item);
            // addWindow.close();

          });

          // Garbage remove
          // 
        }
      },
      {
        label: 'Clear Items',
        click() {
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];
//add empty object to the menu (to remove Electron title)
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {

  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: 'Toggle tools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();

        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

