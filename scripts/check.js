#!/usr/bin/env node
/* Hiwar — repository self-check.
   Runs in CI and locally (`npm run check`). Fails loudly on the mistakes
   that usually ship a broken static app: bad JSON, syntax errors,
   references to files that do not exist, a service worker that caches
   ghosts, or a version that drifted between package.json and manifest. */

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const errors = [];
const notes = [];

const rel = (p) => path.relative(ROOT, p) || ".";
const exists = (p) => fs.existsSync(path.join(ROOT, p));

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function walk(dir, filter) {
  const out = [];
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const relPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(relPath, filter));
    else if (filter(relPath)) out.push(relPath);
  }
  return out;
}

/* 1. JSON files parse */
const jsonFiles = [
  "package.json",
  "manifest.json",
  ...walk(".github", (p) => p.endsWith(".json")),
];
const parsed = {};
for (const file of jsonFiles) {
  try {
    parsed[file] = JSON.parse(read(file));
  } catch (err) {
    errors.push(`${file}: invalid JSON — ${err.message}`);
  }
}

/* 2. JavaScript syntax */
const jsFiles = walk("js", (p) => p.endsWith(".js") && !p.includes("vendor"))
  .concat(walk("electron", (p) => p.endsWith(".js")))
  .concat(walk("scripts", (p) => p.endsWith(".js")));
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ["--check", path.join(ROOT, file)], { stdio: "pipe" });
  } catch (err) {
    errors.push(`${file}: syntax error — ${String(err.stderr || err.message).trim().split("\n")[0]}`);
  }
}

/* 3. Local references in index.html exist */
const html = read("index.html");
const refs = [...html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)].map((m) => m[1]);
for (const ref of refs) {
  if (/^(https?:|data:|mailto:|tel:|app:)/i.test(ref)) continue;
  const clean = ref.split("?")[0];
  if (!exists(clean)) errors.push(`index.html references a missing file: ${clean}`);
}

/* 4. Service worker precache list is real */
const sw = read("sw.js");
const swAssets = [...sw.matchAll(/"\.\/([^"]*)"/g)].map((m) => m[1]).filter(Boolean);
for (const asset of swAssets) {
  if (!exists(asset)) errors.push(`sw.js precaches a missing file: ${asset}`);
}
if (!/hiwar-v\d+/.test(sw)) errors.push("sw.js: cache name must look like hiwar-v<number>");

/* 5. Manifest sanity */
const manifest = parsed["manifest.json"];
if (manifest) {
  for (const field of ["name", "short_name", "start_url", "display", "icons"]) {
    if (!manifest[field]) errors.push(`manifest.json: missing "${field}"`);
  }
  for (const icon of manifest.icons || []) {
    if (!exists(icon.src.replace(/^\.\//, ""))) {
      errors.push(`manifest.json: icon not found — ${icon.src}`);
    }
  }
  if (!manifest.icons?.some((i) => i.purpose === "maskable")) {
    notes.push("manifest.json: no maskable icon declared");
  }
}

/* 6. Version drift */
const pkg = parsed["package.json"];
if (pkg && manifest && manifest.version && manifest.version !== pkg.version) {
  errors.push(
    `version drift: package.json ${pkg.version} vs manifest.json ${manifest.version}`
  );
}

/* Report */
if (notes.length) {
  console.log("Notes:");
  for (const note of notes) console.log("  • " + note);
}


/* 9. Guided practice content is complete and usable offline */
const guidedSrc = read("js/guided.js");
const sceneBlocks = guidedSrc.split(/\n  (\w+): \{\n    title:/).slice(1);
if (sceneBlocks.length < 14) {
  errors.push("js/guided.js: expected at least 7 guided scenes");
}
for (let i = 0; i < sceneBlocks.length; i += 2) {
  const key = sceneBlocks[i];
  const body = sceneBlocks[i + 1] || "";
  const steps = (body.match(/partner: \{/g) || []).length;
  const options = (body.match(/^\s*options: \[/gm) || []).length;
  const arabic = (body.match(/ar: "/g) || []).length;
  const english = (body.match(/en: "/g) || []).length;
  if (steps < 3) errors.push(`js/guided.js: scene "${key}" has only ${steps} steps`);
  if (options !== steps) errors.push(`js/guided.js: scene "${key}" has ${options} option blocks for ${steps} steps`);
  if (arabic !== english || arabic === 0) {
    errors.push(`js/guided.js: scene "${key}" has ${arabic} Arabic lines but ${english} English lines`);
  }
}
if (!/HiwarGuided/.test(guidedSrc)) errors.push("js/guided.js: must expose window.HiwarGuided");
if (!exists("js/guided.js")) errors.push("js/guided.js: missing");
if (!/js\/guided\.js/.test(read("sw.js"))) errors.push("sw.js: js/guided.js is not precached");
if (!/data-mode="guided"/.test(html)) errors.push("index.html: no Guided mode button");

if (errors.length) {
  console.error(`\n✖ ${errors.length} problem(s) found:\n`);
  for (const err of errors) console.error("  • " + err);
  process.exit(1);
}

console.log(
  `✔ Hiwar checks passed — ${jsFiles.length} scripts, ${refs.length} references, ` +
    `${swAssets.length} precached assets, version ${pkg?.version || "?"}`
);
