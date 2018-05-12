import { DownloadManager } from "./downloadManager";
import * as ytdl from "ytdl-core";
import { ContentType } from "./contentType";
import { api } from "electron-util";
import { toggleBtn } from "../utility/toggleBtn";
import {validateYoutubeUrl} from "../utility/ytdlService";

export class ContentAnalyzer {
    /**
     * DOM element that contain us
     */
    private _container: JQuery<HTMLElement>;

    /**
     * DOM element that contain us
     */
    private _urlInput: JQuery<HTMLElement>;

    /**
     * DOM element that contain us
     */
    private _analyzeButton: JQuery<HTMLElement>;

    /**
     * DOM element that contain us
     */
    private _contentTypeRadio: JQuery<HTMLElement>;

    /**
     * DOM element that contain us
     */
    private _saveDirectorySpan: JQuery<HTMLElement>;

    /**
     * DOM element that contain us
     */
    private _changeDirectoryButton: JQuery<HTMLElement>;

    /**
     * Instance of the download manager
     */
    private _downloadManager: DownloadManager;

    constructor(containerDomElement: string, downloadManager: DownloadManager) {
        this._container = $(containerDomElement);
        this._downloadManager = downloadManager;
        this._instantiateDomElements();
        this._bindEvents();
    }

    private _instantiateDomElements() {
        this._container.append(`<div class="row">
        <div class="col-md-8">
            <p class="lead"><strong>Paste here Youtube Link</strong></p>
            <input type="url" class="form-control" id="urlInput" aria-describedby="urlHelp" placeholder="Enter link">
            <small id="urlHelp" class="form-text text-muted">It could be a video, audio or a playlist.</small>
        </div>
        <div class="col-md-4 text-center">
            <p class="lead text-nowrap">Click this button after paste</p>
            <button class="btn btn-outline-primary disabled" id="analyzeButton" disabled>Analyze</button>
        </div>
    </div>
    <div class="row pt-md-2">
        <div class="col-12" >
            <p class="lead"><strong>Check the appropriate type</strong></p>
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="videoLink" checked name="contentTypeRadio" value="Video" class="custom-control-input">
                <label class="custom-control-label" for="videoLink">Video</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="playlistLink" name="contentTypeRadio" value="Playlist" class="custom-control-input">
                <label class="custom-control-label" for="playlistLink">Playlist</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="audioLink" name="contentTypeRadio" value="Audio" class="custom-control-input">
                <label class="custom-control-label" for="audioLink">Audio</label>
            </div>
        </div>
    </div>
    <div class="row pt-md-2">
        <div class="col-md-8" >
            <p class="lead"><strong>Check the directory</strong></p>
            <p class="lead">
                Current save directory: <span id="saveDirectorySpan"></span>
            </p>
        </div>
        <div class="col-md-4 text-center">
            <p class="lead text-nowrap">Click this button to change</p>
            <button class="btn btn-outline-primary" id="changeDirectoryButton">Change</button>
        </div>
    </div>`);
        this._urlInput = $("#urlInput");
        this._analyzeButton = $("#analyzeButton");
        this._contentTypeRadio = $("input[type=radio][name=contentTypeRadio]");
        this._changeDirectoryButton = $("#changeDirectoryButton");
        this._saveDirectorySpan = $("#saveDirectorySpan");
        this._saveDirectorySpan.text(this._downloadManager.saveDirectory);
    }

    private _bindEvents() {
        this._urlInput.on("keyup", (element: any) => {
            console.log(this, $(this), element, element.target.value);
            validateYoutubeUrl(element.target.value).then((result: boolean) => toggleBtn(this._analyzeButton, result)).catch(e => console.error(e));
        });
        this._analyzeButton.on("click", (element: any) => {
            console.log(element, element.target.value, <ContentType>this._contentTypeRadio.filter(":checked").val(), this._contentTypeRadio.filter(":checked").val(), ContentType.Video);
            this._downloadManager.addNewContent(<string>this._urlInput.val(), <ContentType>this._contentTypeRadio.filter(":checked").val());
        });
        this._changeDirectoryButton.on("click", (element: JQuery.Event<HTMLElement>) => {
            const selected = api.dialog.showOpenDialog(
                {
                    title: "Selecte save directory",
                    defaultPath: this._downloadManager.saveDirectory,
                    properties: ["openDirectory"]
                }
            );
            this._downloadManager.saveDirectory = selected[0];
            this._saveDirectorySpan.text(this._downloadManager.saveDirectory);
        });
    }
}