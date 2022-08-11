const electron = require("electron")
const url = require("url")
const path = require("path")
const {FileManager} = require("./files")

const {app, BrowserWindow, Tray, Menu, ipcMain} = electron

const fm = new FileManager()
const htmlDir = path.join(__dirname, "html")

let mainWindow = null
let tray = null
let wpos = [0,0]

function createTray(){
	tray = new Tray("logo.png")
	const cmenu = Menu.buildFromTemplate([
		{
			label: "Open",
			click: ()=>{
				createWindow()
			}
		},
		{
      		label: 'Quit',
      		click: ()=>{
        		app.quit()
      		}
      	}
	])
	tray.setToolTip("Discord Emoji Saver")
	tray.setContextMenu(cmenu)
	tray.on("click",()=>{
		if(!mainWindow){
			createWindow()
		}
		mainWindow.focus()
	})
}

function createWindow(){
	if (!tray) {
    	createTray()
  	}

	mainWindow = new BrowserWindow({resizable:false, width:250, height:350, autoHideMenuBar: true,
	//mainWindow = new BrowserWindow({resizable:false, width:950, height:1050,
		webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
	})
	mainWindow.loadURL(url.format({
		pathname: path.join(htmlDir, "main.html"),
		protocol: "file:",
		slashes: true
	}))
	mainWindow.setPosition(wpos[0], wpos[1])
	mainWindow.on('closed', ()=>{
    	mainWindow = null
  	})
  	mainWindow.on('move', ()=>{
  		wpos = mainWindow.getPosition()
  	})
  	mainWindow.setAlwaysOnTop(true, 'screen');
}

app.on("ready", createWindow)

app.on('window-all-closed', () => {
  // nothing here
})

ipcMain.on("get_emojis", ()=>{
	mainWindow.webContents.send("rcv_emojis", fm.emojiJson)
})

ipcMain.on("add_emoji", (e, value)=>{
	fm.saveEmojiJson(value)
	mainWindow.webContents.send("rcv_emojis", fm.emojiJson)
})

ipcMain.on("delete_emoji", (e, value)=>{
	fm.deleteEmojiJson(value)
	mainWindow.webContents.send("rcv_emojis", fm.emojiJson)
})