"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl = require("ytdl-core");
const sanitize = require("sanitize-filename");
class DownloadableContent {
    constructor(url) {
        this.url = url;
    }
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
    _getInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield ytdl.getInfo(this.url).then(info => this.contentInfo = info).catch(e => console.error(e));
        });
    }
}
exports.DownloadableContent = DownloadableContent;
//# sourceMappingURL=downloadableContent.js.map