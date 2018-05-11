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
    startDownload(itag, path, progressCallback) {
        this.downloading = true;
        this.videoProgress = ytdl(this.url, { format: this.selectedFormat });
        this.videoProgress.pipe(fs.createWriteStream(path + "/" + this.title + "." + this.selectedFormat.container));
        this.videoProgress.on("response", (res) => {
            console.log(res);
            let dataRead = 0;
            const totalSize = parseInt(res.headers["content-length"]);
            let percent = 0;
            res.on("data", data => {
                dataRead += data.length;
                percent = dataRead / totalSize;
                // update
                this.progress = (percent * 100).toFixed(2);
                progressCallback(itag, (percent * 100).toFixed(2));
            });
            res.on("error", (err) => {
                progressCallback(itag, "Error");
                this.progress = undefined;
                this.downloading = undefined;
            });
            res.on("end", () => {
                progressCallback(itag, "Finish");
                this.progress = "Finish!";
                this.downloading = undefined;
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