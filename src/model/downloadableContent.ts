import * as ytdl from "ytdl-core";
import * as sanitize from "sanitize-filename";
export abstract class DownloadableContent {
    public contentInfo: ytdl.videoInfo;
    protected constructor(public url: string) {}
    abstract setup(): Promise<boolean>;
    abstract startDownload(path: string): void;
    abstract stopDownload(): void;
    get title() {
        return sanitize(this.contentInfo.title);
    }
    private async _getInfo() {
        await ytdl.getInfo(this.url).then(info => this.contentInfo = info).catch(e => console.error(e));
    }
}
