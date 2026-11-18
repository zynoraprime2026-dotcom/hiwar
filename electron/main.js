/* ================================================================
   Hiwar (حوار) — desktop shell
   Serves the static app from a privileged app:// origin so the
   renderer gets a real, secure origin (localStorage, fetch to the
   AI API, no file:// quirks). Renderer stays sandboxed: no Node.
   ================================================================ */

"use strict";

const { app, BrowserWindow, Menu, protocol, net, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");

const APP_ID = "com.hiwar.tutor";
const APP_ROOT = path.join(__dirname, "..");
const START_URL = "app://hiwar/index.html";
const GITHUB_URL = "https://github.com/zynoraprime2026-dotcom/hiwar";
const isDev = process.argv.includes("--dev");

let mainWindow = null;
let lastNormalBounds = null;

/* ---------- app:// protocol ---------- */
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

function resolveAssetPath(requestUrl) {
  let pathname = "/";
  try {
    pathname = new URL(requestUrl).pathname;
  } catch {
    return null;
  }
  let relative = decodeURIComponent(pathname).replace(/^\/+/, "");
  if (relative === "" || relative.endsWith("/")) relative += "index.html";
  const target = path.normalize(path.join(APP_ROOT, relative));
  const root = APP_ROOT.endsWith(path.sep) ? APP_ROOT : APP_ROOT + path.sep;
  if (target !== APP_ROOT && !target.startsWith(root)) return null;
  return target;
}

function registerAppProtocol() {
  protocol.handle("app", async (request) => {
    const filePath = resolveAssetPath(request.url);
    if (!filePath) return new Response("Forbidden", { status: 403 });
    try {
      return await net.fetch(pathToFileURL(filePath).toString());
    } catch {
      return new Response("Not found", { status: 404 });
    }
  });
}

/* ---------- window geometry ---------- */
const stateFile = () => path.join(app.getPath("userData"), "window-state.json");

function readWindowState() {
  try {
    const saved = JSON.parse(fs.readFileSync(stateFile(), "utf8"));
    if (Number.isFinite(saved.width) && Number.isFinite(saved.height)) return saved;
  } catch {
    /* first run, or unreadable — fall through to defaults */
  }
  return { width: 1180, height: 820, maximized: false };
}

function persistWindowState(win) {
  if (!win || win.isDestroyed()) return;
  if (win.isMaximized() || win.isFullScreen()) {
    if (!lastNormalBounds) return;
  } else {
    lastNormalBounds = win.getNormalBounds();
  }
  try {
    fs.writeFileSync(
      stateFile(),
      JSON.stringify({ ...lastNormalBounds, maximized: win.isMaximized() })
    );
  } catch {
    /* not fatal */
  }
}

/* ---------- menu ---------- */
function buildMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    ...(isMac ? [{ role: "appMenu" }] : []),
    {
      label: "File",
      submenu: [
        {
          label: "New chat",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            if (mainWindow) mainWindow.webContents.send("hiwar:new-chat");
          },
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    { role: "editMenu" },
    {
      label: "View",
      submenu: [
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        ...(isDev ? [{ type: "separator" }, { role: "toggleDevTools" }] : []),
      ],
    },
    { role: "windowMenu" },
    {
      role: "help",
      submenu: [
        {
          label: "Hiwar on GitHub",
          click: () => shell.openExternal(GITHUB_URL),
        },
        {
          label: "Report a problem",
          click: () => shell.openExternal(GITHUB_URL + "/issues/new"),
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/* ---------- main window ---------- */
function createWindow() {
  const saved = readWindowState();
  lastNormalBounds = { x: saved.x, y: saved.y, width: saved.width, height: saved.height };

  mainWindow = new BrowserWindow({
    width: saved.width,
    height: saved.height,
    ...(Number.isFinite(saved.x) && Number.isFinite(saved.y)
      ? { x: saved.x, y: saved.y }
      : {}),
    minWidth: 380,
    minHeight: 520,
    show: false,
    backgroundColor: "#0f172a",
    title: "Hiwar — Arabic Conversation Tutor",
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: true,
    },
  });

  if (saved.maximized) mainWindow.maximize();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // External links open in the user's browser, never inside the app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("app://hiwar/")) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.on("close", () => persistWindowState(mainWindow));
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadURL(START_URL);
  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });
}

/* ---------- lifecycle ---------- */
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.setAppUserModelId(APP_ID);

  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    registerAppProtocol();
    buildMenu();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
