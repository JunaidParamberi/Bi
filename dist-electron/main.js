import { app, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    fullscreen: true,
    // Opens in full screen
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // Preload script
      nodeIntegration: false,
      // Disable nodeIntegration for security
      contextIsolation: true,
      // Use context isolation for additional protection
      // Enable touch events explicitly
      additionalArguments: ["--touch-events=enabled"]
    }
  });
  win.maximize();
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    if (!app.isPackaged) {
      win.webContents.openDevTools({ mode: "detach" });
    }
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    if (app.isPackaged) {
      win.webContents.on("devtools-opened", () => {
        win == null ? void 0 : win.webContents.closeDevTools();
      });
    }
  }
  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12" || input.control && input.shift && input.key.toLowerCase() === "i") {
      event.preventDefault();
    }
  });
}
function removeDefaultMenu() {
  if (app.isPackaged) {
    Menu.setApplicationMenu(null);
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  if (process.env.NODE_ENV !== "development") {
    process.env.NODE_ENV = "production";
  }
  createWindow();
  removeDefaultMenu();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
