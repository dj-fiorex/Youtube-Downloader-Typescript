"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const downloadableContent_1 = require("./downloadableContent");
const ytdl = require("ytdl-core");
const fs = require("fs");
class Video extends downloadableContent_1.DownloadableContent {
    constructor(url) {
        if (ytdl.validateURL(url)) {
            super(url);
        }
        else {
            throw new Error("Not a youtube url!");
        }
    }
    setup() {
        return new Promise((resolve, reject) => {
            ytdl.getInfo(this.url).then(info => {
                this.contentInfo = info;
                resolve(true);
            }).catch(e => {
                console.error(e);
                reject(false);
            });
        });
    }
    getFormats() {
        return this.contentInfo.formats.filter(videoFormat => videoFormat.type.includes("video"));
    }
    selectFormat(itag) {
        this.contentInfo.formats.forEach(format => {
            if (format.itag === itag) {
                this.selectedFormat = format;
            }
        });
    }
    startDownload(path) {
        this.downloading = true;
        this.videoProgress = ytdl(this.url, { format: this.selectedFormat });
        this.savePath = path + "/" + this.title + "." + this.selectedFormat.container;
        this.videoProgress.pipe(fs.createWriteStream(this.savePath));
        return new Promise((resolve, reject) => {
            this.videoProgress.on("response", (res) => {
                resolve(res);
            });
        });
    }
    stopDownload() {
        console.log("Stop Download");
        this.videoProgress.destroy();
        this.progress = undefined;
        this.downloading = undefined;
    }
}
exports.Video = Video;
//# sourceMappingURL=video.js.map