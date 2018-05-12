import * as ytdl from "ytdl-core";

export async function validateYoutubeUrl(link: string) {
    return ytdl.validateURL(link);
}