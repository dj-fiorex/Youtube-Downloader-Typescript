import { DownloadableContent } from "./downloadableContent";
import * as ytpl from "ytpl";
import * as ytdl from "ytdl-core";
import * as fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { YoutubePlaylist } from "./youtubePlaylist";


export class Playlist extends DownloadableContent {
    public contentInfo: YoutubePlaylist;
    public downloading: boolean;
    public videoProgress: Readable;
    public progress: string;
    public savePath: string;
    constructor(url: string) {
        super(url);
    }
    setup() {
        return new Promise<boolean>((resolve, reject) => {
            ytpl(this.url).then((info: any) => {
                this.contentInfo = info;
                resolve(true);
            }).catch(e => {
                console.error(e);
                reject(false);
            });
        });
    }
    startDownload(path: string): Promise<IncomingMessage> {
        this.contentInfo.items.forEach(item => {

        })
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