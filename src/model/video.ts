import { DownloadableContent } from "./downloadableContent";
import * as ytdl from "ytdl-core";
import * as fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import sanitize = require("sanitize-filename");


export class Video extends DownloadableContent {
    public contentInfo: ytdl.videoInfo;
    public selectedFormat: ytdl.videoFormat;
    public downloading: boolean;
    public videoProgress: Readable;
    public progress: string;
    public savePath: string;
    constructor(url: string) {
        if (ytdl.validateURL(url)) {
            super(url);
        } else {
            throw new Error("Not a youtube url!");
        }
    }
    get title() {
        return sanitize(this.contentInfo.title);
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
    selectFormat(itag: number) {
        console.log(this.contentInfo);
        this.contentInfo.formats.forEach(format => {
            if (format.itag === itag) {
                this.selectedFormat = format;
            }
        });
    }
    startDownload(path: string): Promise<IncomingMessage> {
        this.downloading = true;
        this.videoProgress = ytdl(this.url, { format: this.selectedFormat });
        this.savePath = path + "/" + this.title + "." + this.selectedFormat.container;
        this.videoProgress.pipe(fs.createWriteStream(this.savePath));
        return new Promise((resolve) => {
            this.videoProgress.on("response", (res: IncomingMessage) => {
                resolve(res);
            });
        });
    }
    stopDownload(): void {
        console.log("Stop Download");
        this.videoProgress.destroy();
        this.progress = undefined;
        this.downloading = false;
    }


}