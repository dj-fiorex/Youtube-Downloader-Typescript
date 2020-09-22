"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const downloadableContent_1 = require("./downloadableContent");
const ytpl = require("ytpl");
const ytdl = require("ytdl-core");
const fs = require("fs");
class Playlist extends downloadableContent_1.DownloadableContent {
    constructor(url) {
        super(url);
    }
    setup() {
        return new Promise((resolve, reject) => {
            ytpl(this.url).then((info) => {
                this.contentInfo = info;
                resolve(true);
            }).catch(e => {
                console.error(e);
                reject(false);
            });
        });
    }
    startDownload(path) {
        this.contentInfo.items.forEach(item => {
        });
        this.videoProgress = ytdl(this.url, { format: this.selectedFormat });
        this.savePath = path + "/" + this.title + "." + this.selectedFormat.container;
        this.videoProgress.pipe(fs.createWriteStream(this.savePath));
        return new Promise((resolve) => {
            this.videoProgress.on("response", (res) => {
                resolve(res);
            });
        });
    }
    stopDownload() {
        console.log("Stop Download");
        this.videoProgress.destroy();
        this.progress = undefined;
        this.downloading = false;
    }
}
exports.Playlist = Playlist;
//# sourceMappingURL=playlist.js.map