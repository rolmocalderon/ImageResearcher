const electron = require('electron');
const url = require('url');
const path = require('path');
const connection = require('./connect');

const {app, BrowserWindow, Menu, ipcMain} = electron;

//Set ENV
//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

app.on('ready', function(){
    //Create new window
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1000,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle create add window
function createAddWindow(){
    //Create new window

    addWindow = new BrowserWindow({
        height: 200,
        width: 300,
        title: 'Add image',
        webPreferences: {
            nodeIntegration: true
        }
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    //Garbage collection handle
    addWindow.on('closed', function(){
        addWindow = null;
    });
}

//Catch item:add
ipcMain.on('item:add', function(event, item){
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

ipcMain.on('addItem', function(){
    createAddWindow();
});

//Create Menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: 'F12',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}