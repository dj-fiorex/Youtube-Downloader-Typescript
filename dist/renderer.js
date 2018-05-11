"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const video_1 = require("./model/video");
const downloadManager_1 = require("./model/downloadManager");
const contentAnalyzer_1 = require("./model/contentAnalyzer");
const baseContainer = "#app";
const analizerContainer = "#analyzer";
const d = new downloadManager_1.DownloadManager(baseContainer);
const ca = new contentAnalyzer_1.ContentAnalyzer(analizerContainer, d);
const c = new video_1.Video("https://www.youtube.com/watch?v=qke-jOUqSXU");
console.log(c, "mb");
//# sourceMappingURL=renderer.js.map