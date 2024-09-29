import { app, BrowserWindow, Menu } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let win: BrowserWindow | null

// Create the main window
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, 'src/assets/icons/Icon_Accent Green.icns'),
    fullscreen: true,  // Opens in full screen
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,  // Disable nodeIntegration for security
      contextIsolation: true,  // Use context isolation for security
    },
  })

  // Load the React app
  const startURL = process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, '../dist/index.html')}`
  win.loadURL(startURL)

  // Maximize window if not fullscreen
  win.maximize()

  if (process.env.VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools({ mode: 'detach' })
  }

  // Disable DevTools in production
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      event.preventDefault()
    }
  })
}

// Remove the default menu in production
function removeDefaultMenu() {
  if (app.isPackaged) {
    Menu.setApplicationMenu(null)
  }
}

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Create the window when the app is ready
app.whenReady().then(() => {
  createWindow()
  removeDefaultMenu()
}) /// <reference types="vite-plugin-electron/electron-env" />

