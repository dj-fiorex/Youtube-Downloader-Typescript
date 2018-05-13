import * as ytdl from "ytdl-core";
import * as sanitize from "sanitize-filename";
export abstract class DownloadableContent {
    protected constructor(public url: string) {}
    abstract setup(): Promise<boolean>;
    abstract startDownload(path: string): void;
    abstract stopDownload(): void;
}
