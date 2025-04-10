export interface AlbumSpotify{
    id:string;
    name:string;
    release_date :string;
    total_tracks :number;
    album_type:string;
    popularity?:number;
    images:{url:string;height:number;width:number}[];
}

export interface TrackSpotify{
    id:string;
    name:string;
    track_number:number;
    duration_ms:number;
    popularity?:number;
    preview_url?:string;
}

export interface AlbumDetailsSpotify extends AlbumSpotify {
    tracks:{
        items:TrackSpotify[];
    };
}

export interface ApiResponseSpotify<T>{
    items:T[];
    total :number;
    limit:number;
    offset:number;
}