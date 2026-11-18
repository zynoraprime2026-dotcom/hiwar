/* Hiwar desktop bridge — the only thing the web app can see from the shell.
   Keeps the renderer sandboxed: no Node, no filesystem, no arbitrary IPC. */

"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("hiwarDesktop", {
  isDesktop: true,
  platform: process.platform,
  // Native menu → "New chat"
  onNewChat: (handler) => {
    if (typeof handler !== "function") return;
    ipcRenderer.on("hiwar:new-chat", () => handler());
  },
});
