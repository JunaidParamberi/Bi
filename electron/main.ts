// main.ts (Main process)
import { app, BrowserWindow, Menu } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// Create the main window with touch support enabled
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    fullscreen: true,  // Opens in full screen
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,  // Disable nodeIntegration for security
      contextIsolation: true,  // Use context isolation for additional protection
      enableRemoteModule: false,  // Disable remote module for security
      // Enable touch events explicitly
      additionalArguments: ['--touch-events=enabled'],
    },
  })

  // Maximize window if fullscreen is not enabled
  win.maximize()

  // Load URL based on environment
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)

    // Only open DevTools if in development mode
    if (!app.isPackaged) {
      win.webContents.openDevTools({ mode: 'detach' })
    }
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))

    // Ensure DevTools are closed in production
    if (app.isPackaged) {
      win.webContents.on('devtools-opened', () => {
        win?.webContents.closeDevTools()
      })
    }
  }

  // Prevent DevTools from opening via shortcut (F12, Ctrl+Shift+I, etc.)
  win.webContents.on('before-input-event', (event, input) => {
    if (
      input.key === 'F12' ||
      (input.control && input.shift && input.key.toLowerCase() === 'i')
    ) {
      event.preventDefault()
    }
  })
}

// Remove the default menu in production
function removeDefaultMenu() {
  if (app.isPackaged) {
    Menu.setApplicationMenu(null) // This removes the default menu entirely
  }
}

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // Re-create a window if no other windows are open (macOS specific behavior).
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Enforce production mode
app.whenReady().then(() => {
  if (process.env.NODE_ENV !== 'development') {
    process.env.NODE_ENV = 'production'
  }
  createWindow()
  removeDefaultMenu()  // Remove the default menu if in production
})

