const { api } = require('electron-util');
import { DownloadableContent } from "./downloadableContent";
import { IdGenerator } from "../utility/idGenerator";
import { Video } from "./video";
import { ContentType } from "./contentType";
import { checkPath } from "../utility/checkPath";
import { shell } from "electron";
import { IncomingMessage } from "http";

export class DownloadManager {
    /**
     * DOM element that contain us
     */
    private _container: JQuery<HTMLElement>;

    /**
     * DOM element that contain us
     */
    private _selectQualityModal: any;

    /**
     * Reference to the downloading table on the DOM
     */
    private _downloadingContentTableRef: JQuery<HTMLElement>;

    /**
     * Reference to the finished table on the DOM
     */
    private _finishedContentTableRef: JQuery<HTMLElement>;

    /**
     * Reference to the to the select quality modal on the DOM
     */
    private _selectQualityModalTitle: JQuery<HTMLElement>;

    /**
     * Reference to the table on the select quality modal on the DOM
     */
    private _selectQualityModalTable: JQuery<HTMLElement>;

    /**
     * Array to store all items to download
     */
    private _items: DownloadableContent[];

    /**
     * Utility to generate unique id
     */
    private _idGenerator: IdGenerator;

    /**
     * Utility to generate unique id
     */
    private _downloadIdGenerator: IdGenerator;

    /**
     * Where to save new videos
     */
    public saveDirectory: string;


    constructor(containerDomElement: string) {
        this._container = $(containerDomElement);
        const documentPath = api.app.getPath("documents");
        if (checkPath(documentPath + "\\YoutubeDownloader", true)) {
            this.saveDirectory = documentPath + "\\YoutubeDownloader";
        } else {
            this.saveDirectory = "Error with save directory";
        }
        this._idGenerator = new IdGenerator();
        this._downloadIdGenerator = new IdGenerator();
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

    async addNewContent(url: string, type: ContentType) {

        try {
            const video = new Video(url);
            await video.setup();
            this._selectQualityModalTitle.text(video.title);
            video.contentInfo.formats.forEach(format => {
                //if (format.type.includes(type)) {
                    this._selectQualityModalTable.append(`
                        <tr>
                            <th scope="row">${this._idGenerator.next().value}</th>
                            <td>${format.codecs}</td>
                            <td>${format.width}</td>
                            <td>${format.container}</td>
                            <td><button class="btn btn-primary selectable" value="${format.itag}">Select</button></td>
                        </tr>
                    `);
              // }
            });
            $(".selectable").one("click", (element: any) => {
                this._selectQualityModalTable.empty();
                console.log(element);
                video.selectFormat(parseInt(element.target.value));
                this._selectQualityModal.modal("hide");
                this._items.push(video);
                this._addDownloadingItemToTable(video);
                video.startDownload(this.saveDirectory).then((res: IncomingMessage) => {
                    let dataRead = 0;
                    const totalSize: number = parseInt(res.headers["content-length"]);
                    let percent = 0;
                    res.on("data", data => {
                        const progressThis = $(`#progress-${element.target.value}`);
                        dataRead += data.length;
                        percent = dataRead / totalSize;
                        // update
                        progressThis.css("width", parseInt((percent * 100).toFixed(2)) + "%").html(parseInt((percent * 100).toFixed(2)) + "%");
                    });
                    res.on("error", (err: Error) => {
                        const progressThis = $(`#progress-${element.target.value}`),
                            stopThis = $(`#stop-${element.target.value}`);
                        progressThis.css("width", "0").html("Error");
                        stopThis.removeClass("btn-danger").addClass("btn-primary").html("Retry");
                    });
                    res.on("end", () => {
                        // Handle finish -> move to other table
                        const htmlElement = $("#row-" + element.target.value).remove();
                        htmlElement.find("#stop-" + element.target.value).remove();
                        htmlElement.append(`<td><button class="btn btn-outline-primary" id="open-${element.target.value}" value="button-${element.target.value}">Open</button></td>`);
                        $("#finishedContentTable").append(htmlElement);
                        $("#open-" + element.target.value).on("click", () => {
                            shell.openExternal(video.savePath);
                        });
                    });
                });
            });
            this._selectQualityModal.on("hidden.bs.modal", () => {
                this._selectQualityModalTable.empty();
            })
            this._selectQualityModal.modal("show");
            this._idGenerator.reset();
        } catch (e) {
            console.error(e);
        }
    }

    private _addDownloadingItemToTable(video: Video) {
        console.log(video);
        this._downloadingContentTableRef.append(`<tr id="row-${video.selectedFormat.itag}">
            <th scope="row">${this._downloadIdGenerator.next().value}</th>
            <td>${video.title}</td>
            <td>${video.selectedFormat.codecs}</td>
            <td>${video.selectedFormat.width}</td>
            <td>${video.selectedFormat.container}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" id="progress-${video.selectedFormat.itag}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 1%"></div>
                </div>
            </td>
            <td><button class="btn btn-danger" id="stop-${video.selectedFormat.itag}" value="button-${video.selectedFormat.itag}">Stop</button></td>
            </tr>`);
        const stopThis = $(`#stop-${video.selectedFormat.itag}`);
        stopThis.on("click", () => {
            video.stopDownload();
            $(`#progress-${video.selectedFormat.itag}`).css("width", "0").html("Aborted");
            stopThis.removeClass("btn-danger").addClass("btn-primary").html("Retry");
        });
    }
}
