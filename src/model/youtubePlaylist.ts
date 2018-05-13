export interface Author {
    id: string;
    name: string;
    avatar: string;
    user: string;
    channel_url: string;
    user_url: string;
}

export interface Author2 {
    name: string;
    ref: string;
}

export interface Item {
    id: string;
    url: string;
    url_simple: string;
    title: string;
    thumbnail: string;
    duration: string;
    author: Author2;
}

export interface YoutubePlaylist {
    id: string;
    url: string;
    title: string;
    visibility: string;
    description: string;
    total_items: number;
    views: number;
    last_updated: string;
    author: Author;
    items: Item[];
}
