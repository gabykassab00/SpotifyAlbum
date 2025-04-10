export interface AlbumSpotify{
    id:string;
    name:string;
    release_date :string;
    total_tracks :number;
    album_type:string;
    popularity?:number;
    images:{url:string;height:number;width:number}[];
}