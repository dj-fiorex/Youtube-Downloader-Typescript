import {api} from "electron-util";
import {DownloadableContent} from "./downloadableContent";
import {IdGenerator} from "../utility/idGenerator";
import {Video} from "./video";
import {ContentType} from "./contentType";
import {checkPath} from "../utility/checkPath";
import {shell} from "electron";

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
        if (type === ContentType.Video) {
            try {
                const video = new Video(url);
                await video.setup();
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
                $(".selectable").one("click", (element: any) => {
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
            } catch (e) {
                console.error(e);
            }
        }
    }

    private _downloadProgressCB(itag: string, progress: string) {
        console.log(`Video: ${itag} Progress: ${progress}`);
        const progressThis = $(`#progress-${itag}`),
            stopThis = $(`#stop-${itag}`);
        if (progress === "Error") {
            console.error("Error", progress);
            progressThis.css("width", "0").html("Error");
            stopThis.removeClass("btn-danger").addClass("btn-primary").html("Retry");
        } else if (progress === "Finish") {
            // Handle finish -> move to other table
            let htmlElement = $("#row-" + itag).remove();
            console.log(htmlElement);
            htmlElement.find("#stop-" + itag).remove();
            htmlElement.append(`<td><button class="btn btn-outline-primary" id="open-${itag}" value="button-${itag}">Open</button></td>`);
            $("#open-" + itag).on("click", (element: any) => {
                console.log(this);
                // shell.openExternal()
            });
            $("#finishedContentTable").append(htmlElement);
        } else {
            progressThis.css("width", parseInt(progress) + "%").html(parseInt(progress) + "%");
        }
    }

    private _addDownloadingItemToTable(video: Video) {
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
        stopThis.on("click", (element: any) => {
            video.stopDownload();
            $(`#progress-${video.selectedFormat.itag}`).css("width", "0").html("Aborted");
            stopThis.removeClass("btn-danger").addClass("btn-primary").html("Retry");
        });
    }

    private _addFinishedItemToTable(video: Video) {

    }
}

// <td><span id="progress-${video.selectedFormat.itag}"></span></td>