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
const fs = require("fs-extra");
const electron_util_1 = require("electron-util");
const idGenerator_1 = require("../utility/idGenerator");
const video_1 = require("./video");
class DownloadManager {
    constructor(containerDomElement) {
        this._container = $(containerDomElement);
        const documentPath = electron_util_1.api.app.getPath("documents");
        if (fs.existsSync(documentPath + "\\YoutubeDownloader")) {
            // Do something
            console.log("esiste");
        }
        else {
            console.log("non esiste -> la creo");
            fs.mkdir(`${documentPath}\\YoutubeDownloader`).then(value => console.log(value)).catch(error => console.error(error));
        }
        this.saveDirectory = documentPath + "\\YoutubeDownloader";
        this._idGenerator = new idGenerator_1.IdGenerator();
        this._downloadIdGenerator = new idGenerator_1.IdGenerator();
        this._items = [];
        this.instantiateDomElements();
    }
    instantiateDomElements() {
        this._container.append(`
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="downloading-tab" data-toggle="tab" href="#downloading" role="tab" aria-controls="downloading" aria-selected="true">Downloading</a>
            <a class="nav-item nav-link" id="finished-tab" data-toggle="tab" href="#finished" role="tab" aria-controls="finished" aria-selected="false">Finished</a>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div class="tab-pane fade show active" id="downloading" role="tabpanel" aria-labelledby="downloading-tab">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Resolution</th>
                            <th scope="col">Container</th>
                            <th scope="col">Progress</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody id="downloadingContentTable">
                        </tbody>
                    </table>
                </div>  
          </div>
            <div class="tab-pane fade" id="finished" role="tabpanel" aria-labelledby="finished-tab">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Resolution</th>
                            <th scope="col">Container</th>
                            <th scope="col">Progress</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody id="finishedContentTable">
                        </tbody>
                    </table>
                </div>  
            </div>
        </div>   
        </div>
    <!-- Modal -->
    <div class="modal fade" id="selectQualityModal" tabindex="-1" role="dialog" aria-labelledby="selectQualityModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="selectQualityModalTitle"></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Type</th>
                            <th scope="col">Resolution</th>
                            <th scope="col">Container</th>
                            <th scope="col">Select</th>
                        </tr>
                        </thead>
                        <tbody id="selectQualityModalTable">
                        </tbody>
                    </table>
                </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
   `);
        this._downloadingContentTableRef = $("#downloadingContentTable");
        this._finishedContentTableRef = $("#finishedContentTable");
        this._selectQualityModalTitle = $("#selectQualityModalTitle");
        this._selectQualityModalTable = $("#selectQualityModalTable");
        this._selectQualityModal = $("#selectQualityModal");
    }
    addNewContent(url, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === "Video" /* Video */) {
                try {
                    const video = new video_1.Video(url);
                    yield video.setup();
                    console.log("Video: ", video);
                    this._selectQualityModalTitle.text(video.title);
                    console.log(video, "mbare", video.getFormats());
                    video.contentInfo.formats.forEach(format => {
                        this._selectQualityModalTable.append(`
                        <tr>
                            <th scope="row">${this._idGenerator.next().value}</th>
                            <td>${format.type}</td>
                            <td>${format.resolution}</td>
                            <td>${format.container}</td>
                            <td><button class="btn btn-primary selectable" value="${format.itag}">Select</button></td>
                        </tr>
                    `);
                    });
                    $(".selectable").one("click", (element) => {
                        this._selectQualityModalTable.html("");
                        video.selectFormat(element.target.value);
                        this._selectQualityModal.modal("hide");
                        this._items.push(video);
                        this._addDownloadingItemToTable(video);
                        console.log(element.target.value);
                        video.startDownload(element.target.value, this.saveDirectory, this._downloadProgressCB);
                    });
                    this._selectQualityModal.modal("show");
                    this._idGenerator.reset();
                }
                catch (e) {
                    console.error(e);
                }
            }
        });
    }
    _downloadProgressCB(itag, progress) {
        console.log(`Video: ${itag} Progress: ${progress}`);
        const progressThis = $(`#progress-${itag}`), stopThis = $(`#stop-${itag}`);
        if (progress === "Error") {
            console.error("Error", progress);
            progressThis.css("width", "0").html("Error");
            stopThis.removeClass("btn-danger").addClass("btn-primary").html("Retry");
        }
        else if (progress === "Finish") {
            // Handle finish -> move to other table
        }
        else {
            progressThis.css("width", parseInt(progress) + "%").html(parseInt(progress) + "%");
        }
    }
    _addDownloadingItemToTable(video) {
        this._downloadingContentTableRef.append(`<tr id="row-${video.selectedFormat.itag}">
            <th scope="row">${this._downloadIdGenerator.next().value}</th>
            <td>${video.title}</td>
            <td>${video.selectedFormat.type}</td>
            <td>${video.selectedFormat.resolution}</td>
            <td>${video.selectedFormat.container}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" id="progress-${video.selectedFormat.itag}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 1%"></div>
                </div>
            </td>
            <td><button class="btn btn-danger" id="stop-${video.selectedFormat.itag}" value="button-${video.selectedFormat.itag}">Stop</button></td>
            </tr>`);
        const stopThis = $(`#stop-${video.selectedFormat.itag}`);
        stopThis.on("click", (element) => {
            video.stopDownload();
            $(`#progress-${video.selectedFormat.itag}`).css("width", "0").html("Aborted");
            stopThis.removeClass("btn-danger").addClass("btn-primary").html("Retry");
        });
    }
}
exports.DownloadManager = DownloadManager;
// <td><span id="progress-${video.selectedFormat.itag}"></span></td>
//# sourceMappingURL=downloadManager.js.map