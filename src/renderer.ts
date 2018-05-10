// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import { Video } from "./model/video";
import { DownloadManager } from "./model/downloadManager";
import { ContentAnalyzer } from "./model/contentAnalyzer";

const baseContainer = "#app";
const analizerContainer = "#analyzer";
const d = new DownloadManager(baseContainer);
const ca = new ContentAnalyzer(analizerContainer, d);
const c = new Video("https://www.youtube.com/watch?v=qke-jOUqSXU");
console.log(c, "mb");