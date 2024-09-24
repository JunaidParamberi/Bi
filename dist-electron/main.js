import { app as n, BrowserWindow as i, Menu as p } from "electron";
import { fileURLToPath as d } from "node:url";
import o from "node:path";
const r = o.dirname(d(import.meta.url));
process.env.APP_ROOT = o.join(r, "..");
const s = process.env.VITE_DEV_SERVER_URL, E = o.join(process.env.APP_ROOT, "dist-electron"), l = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? o.join(process.env.APP_ROOT, "public") : l;
let e;
function c() {
  e = new i({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    fullscreen: !0,
    // Opens in full screen
    webPreferences: {
      preload: o.join(r, "preload.mjs"),
      nodeIntegration: !1,
      // Disable nodeIntegration for security
      contextIsolation: !0
      // Use context isolation for additional protection
    }
  }), e.maximize(), s ? (e.loadURL(s), n.isPackaged || e.webContents.openDevTools({ mode: "detach" })) : (e.loadFile(o.join(l, "index.html")), n.isPackaged && e.webContents.on("devtools-opened", () => {
    e == null || e.webContents.closeDevTools();
  })), e.webContents.on("before-input-event", (a, t) => {
    (t.key === "F12" || t.control && t.shift && t.key.toLowerCase() === "i") && a.preventDefault();
  });
}
function f() {
  n.isPackaged && p.setApplicationMenu(null);
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && c();
});
n.whenReady().then(() => {
  process.env.NODE_ENV !== "development" && (process.env.NODE_ENV = "production"), c(), f();
});
export {
  E as MAIN_DIST,
  l as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};
