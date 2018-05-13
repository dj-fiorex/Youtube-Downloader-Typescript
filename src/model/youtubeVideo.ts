export interface Author {
    id: string;
    name: string;
    avatar: string;
    user: string;
    channel_url: string;
    user_url: string;
}

export interface PlaybackTracking {
}

export interface Thumbnail2 {
    url: string;
    width: number;
    height: number;
}

export interface Thumbnail {
    thumbnails: Thumbnail2[];
}

export interface VideoDetails {
    thumbnail: Thumbnail;
}

export interface EndscreenUrlRenderer {
    url: string;
}

export interface Endscreen {
    endscreenUrlRenderer: EndscreenUrlRenderer;
}

export interface AdSafetyReason {
    isRemarketingEnabled: boolean;
    isFocEnabled: boolean;
}

export interface PlayerResponse {
    playbackTracking: PlaybackTracking;
    videoDetails: VideoDetails;
    endscreen: Endscreen;
    adSafetyReason: AdSafetyReason;
}

export interface Format {
    sp: string;
    quality: string;
    url: string;
    s: string;
    type: string;
    itag: string;
    container: string;
    resolution: string;
    encoding: string;
    profile: string;
    bitrate: string;
    audioEncoding: string;
    audioBitrate?: number;
    index: string;
    init: string;
    fps: string;
    lmt: string;
    projection_type: string;
    quality_label: string;
    clen: string;
    size: string;
    xtags: string;
}

export interface RelatedVideo {
    title: string;
    endscreen_autoplay_session_data: string;
    id: string;
    iurlhq: string;
    short_view_count_text: string;
    session_data: string;
    author: string;
    iurlmq: string;
    length_seconds: string;
    thumbnail_ids: string;
    playlist_title: string;
    playlist_iurlhq: string;
    playlist_length: string;
    list: string;
    video_id: string;
    playlist_iurlmq: string;
}

export interface YoutubeVideo {
    fexp: string[];
    shortform: string;
    show_content_thumbnail: string;
    plid: string;
    loudness: string;
    enabled_engage_types: string;
    account_playback_token: string;
    root_ve_type: string;
    tmi: string;
    uid: string;
    iv_allow_in_place_switch: string;
    host_language: string;
    title: string;
    ad_logging_flag: string;
    relative_loudness: string;
    vmap: string;
    ismb: string;
    eventid: string;
    sffb: string;
    dclk: string;
    midroll_freqcap: string;
    ad_device: string;
    ptk: string;
    apiary_host: string;
    atc: string;
    apply_fade_on_midrolls: string;
    author: Author;
    instream: string;
    remarketing_url: string;
    ad3_module: string;
    length_seconds: string;
    innertube_api_key: string;
    cid: string;
    core_dbp: string;
    hl: string;
    watermark: string[];
    gapi_hint_params: string;
    ad_flags: string;
    player_response: PlayerResponse;
    itct: string;
    gpt_migration: string;
    fade_out_start_milliseconds: string;
    csi_page_type: string;
    fflags: string;
    fade_out_duration_milliseconds: string;
    external_play_video: string;
    loeid: string;
    ucid: string;
    keywords: string[];
    invideo: string;
    encoded_ad_safety_reason: string;
    ppv_remarketing_url: string;
    timestamp: string;
    storyboard_spec: string;
    thumbnail_url: string;
    instream_long: string;
    videostats_playback_base_url: string;
    mpvid: string;
    is_listed: string;
    afv_ad_tag_restricted_to_instream: string;
    player_error_log_fraction: string;
    allow_html5_ads: string;
    iv_load_policy: string;
    iv3_module: string;
    ad_tag: string;
    rmktEnabled: string;
    allow_below_the_player_companion: string;
    avg_rating: string;
    fade_in_duration_milliseconds: string;
    innertube_context_client_version: string;
    token: string;
    vid: string;
    fade_in_start_milliseconds: string;
    cver: string;
    ssl: string;
    no_get_video_log: string;
    idpj: string;
    xhr_apiary_host: string;
    view_count: string;
    afv_ad_tag: string;
    fmt_list: string[][];
    vss_host: string;
    oid: string;
    cl: string;
    cr: string;
    trueview: string;
    tag_for_child_directed: string;
    t: string;
    ad_preroll: string;
    of: string;
    probe_url: string;
    innertube_api_version: string;
    ldpj: string;
    enablecsi: string;
    apiary_host_firstparty: string;
    serialized_ad_ux_config: string;
    ptchn: string;
    dbp: string;
    pltype: string;
    allow_embed: string;
    allow_ratings: string;
    status: string;
    gut_tag: string;
    vm: string;
    iv_invideo_url: string;
    as_launched_in_country: string;
    ad_slots: string;
    midroll_prefetch_size: string;
    afv: string;
    csn: string;
    c: string;
    video_id: string;
    baseUrl: string;
    afv_invideo_ad_tag: string;
    afv_instream_max: string;
    aftv: string;
    formats: Format[];
    published: number;
    description: string;
    related_videos: RelatedVideo[];
    video_url: string;
}

