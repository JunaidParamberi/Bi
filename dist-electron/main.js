import { app, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, "src/assets/icons/Icon_Accent Green.icns"),
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  const startURL = process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, "../dist/index.html")}`;
  win.loadURL(startURL);
  win.maximize();
  if (process.env.VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools({ mode: "detach" });
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
  }
});
app.whenReady().then(() => {
  createWindow();
  removeDefaultMenu();
});
