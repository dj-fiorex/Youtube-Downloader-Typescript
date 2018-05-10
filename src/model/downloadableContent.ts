import * as ytdl from "ytdl-core";
import * as sanitize from "sanitize-filename";
export abstract class DownloadableContent {
    public contentInfo: ytdl.videoInfo;

    protected constructor(public url: string) {}
    abstract setup(): Promise<boolean>;
    abstract startDownload(itag: string, path: string, progressCallback: any): void;
    abstract stopDownload(): void;
    // get info() {
    //     return new Promise((resolve, reject) => {
    //         if (this.contentInfo === undefined) {
    //             this._getInfo().then(() => {
    //                 resolve(this.contentInfo);
    //             });
    //         } else {
    //             resolve(this.contentInfo);
    //         }
    //     });
    // }
    get title() {
        return sanitize(this.contentInfo.title);
        // return new Promise<string>((resolve, reject) => {
        //     if (this.contentInfo === undefined) {
        //         this._getInfo().then(() => {
        //             resolve(sanitize(this.contentInfo.title));
        //         });
        //     } else {
        //         resolve(sanitize(this.contentInfo.title));
        //     }
        // });
    }
    private async _getInfo() {
        await ytdl.getInfo(this.url).then(info => this.contentInfo = info).catch(e => console.error(e));
    }
}
