import { DownloadableContent } from "./downloadableContent";
import * as ytdl from "ytdl-core";
import * as fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { Observable, from } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { fromObservable } from "rxjs/internal/observable/fromObservable";


export class Video extends DownloadableContent {
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
    startDownload(path: string): Promise<IncomingMessage> {
        this.downloading = true;
        this.videoProgress = ytdl(this.url, { format: this.selectedFormat });
        this.savePath = path + "/" + this.title + "." + this.selectedFormat.container;
        this.videoProgress.pipe(fs.createWriteStream(this.savePath));
        return new Promise((resolve, reject) => {
            this.videoProgress.on("response", (res: IncomingMessage) => {
                resolve(res);
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