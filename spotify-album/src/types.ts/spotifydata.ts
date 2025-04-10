export interface SpotifyAlbum {
    id: string;
    name: string;
    release_date: string;
    total_tracks: number;
    album_type: string;
    popularity?: number;
    images: { url: string; height: number; width: number }[];
  }
  
  export interface SpotifyTrack {
    id: string;
    name: string;
    track_number: number;
    duration_ms: number;
    popularity?: number;
    preview_url?: string;
  }
  
  export interface SpotifyAlbumDetails extends SpotifyAlbum {
    tracks: {
      items: SpotifyTrack[];
    };
  }
  
  export interface SpotifyApiResponse<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
  }