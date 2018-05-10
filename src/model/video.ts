import { DownloadableContent } from "./downloadableContent";
import * as ytdl from "ytdl-core";
import * as fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";


export class Video extends DownloadableContent {
    public selectedFormat: ytdl.videoFormat;
    public downloading: boolean;
    public videoProgress: Readable;
    public progress: string;
    constructor(url: string) {
        if (ytdl.validateURL(url)) {
            super(url);
        } else {
            throw new Error("Not a youtube url!");
        }
    }
    setup() {
        return new Promise<boolean>((resolve, reject) => {
            ytdl.getInfo(this.url).then(info => {
                this.contentInfo = info;
                resolve(true);
            }).catch(e => {
                console.error(e);
                reject(false);
            });
        });
    }
    getFormats(): ytdl.videoFormat[] {
        return this.contentInfo.formats.filter(videoFormat => videoFormat.type.includes("video"));
    }
    selectFormat(itag: string) {
        this.contentInfo.formats.forEach(format => {
            if (format.itag === itag) {
                this.selectedFormat = format;
            }
        });
    }
    startDownload(itag: string, path: string, progressCallback: any): void {
        this.downloading = true;
        this.videoProgress = ytdl(this.url, { format: this.selectedFormat });
        this.videoProgress.pipe(fs.createWriteStream(path + "/" + this.title + "." + this.selectedFormat.container));
        this.videoProgress.on("response", (res: IncomingMessage) => {
            console.log(res);
            let dataRead = 0;
            const totalSize: number = parseInt(res.headers["content-length"]);
            let percent = 0;
            res.on("data", data => {
                dataRead += data.length;
                percent = dataRead / totalSize;
                // update
                this.progress = (percent * 100).toFixed(2);
                progressCallback(itag, (percent * 100).toFixed(2));
            });
            res.on("error", (err: Error) => {
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
    stopDownload(): void {
        console.log("Stop Download");
        this.videoProgress.destroy();
        this.progress = undefined;
        this.downloading = undefined;
    }


}