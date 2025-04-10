import axios from 'axios';
import {AlbumSpotify,AlbumDetailsSpotify} from '../types.ts/spotifydata';

const API_BASE_SPOTIFY = process.env.APP_API_BASE;
const TOKEN_REFRESH_URL = process.env.APP_TOKEN_REFRESH;
const ID_ARTIST = process.env.APP_ARTIST_ID;

let ACCESS_TOKEN = process.env.APP_ACCESS_TOKEN;