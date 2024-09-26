import { app as t, BrowserWindow as a, Menu as c } from "electron";
import { fileURLToPath as l } from "url";
import n from "path";
const i = n.dirname(l(import.meta.url));
let e;
function f() {
  e = new a({
    icon: n.join(i, "src/assets/icons/Icon_Accent Green.icns"),
    fullscreen: !0,
    // Opens in full screen
    webPreferences: {
      preload: n.join(i, "preload.js"),
      nodeIntegration: !1,
      // Disable nodeIntegration for security
      contextIsolation: !0
      // Use context isolation for security
    }
  });
  const r = process.env.VITE_DEV_SERVER_URL || `file://${n.join(i, "../dist/index.html")}`;
  e.loadURL(r), e.maximize(), process.env.VITE_DEV_SERVER_URL && e.webContents.openDevTools({ mode: "detach" }), e.webContents.on("before-input-event", (s, o) => {
    (o.key === "F12" || o.control && o.shift && o.key.toLowerCase() === "i") && s.preventDefault();
  });
}
function d() {
  t.isPackaged && c.setApplicationMenu(null);
}
t.on("window-all-closed", () => {
  process.platform !== "darwin" && t.quit();
});
t.whenReady().then(() => {
  f(), d();
});
