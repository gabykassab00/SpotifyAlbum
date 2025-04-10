import axios from 'axios';
import {AlbumSpotify,AlbumDetailsSpotify} from '../types.ts/spotifydata';

const API_BASE_SPOTIFY = process.env.APP_API_BASE;
const TOKEN_REFRESH_URL = process.env.APP_TOKEN_REFRESH;
const ID_ARTIST = process.env.APP_ARTIST_ID;

let ACCESS_TOKEN = process.env.APP_ACCESS_TOKEN;

const Apispotify = axios.create({
    baseURL:API_BASE_SPOTIFY,
    headers:{
        Authorization:`Bearer ${ACCESS_TOKEN}`,
    },
});

const refreshAccessToken = async (): Promise<string> => {
    try {
        if (!TOKEN_REFRESH_URL) {
            throw new Error('the url is not defined ');
        }
        const response = await axios.get(TOKEN_REFRESH_URL);
        const tokenNew = response.data.access_token;
        if (!tokenNew) {
            throw new Error('there is no token received');
        }
        ACCESS_TOKEN = tokenNew;
        Apispotify.defaults.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
        return tokenNew;
    } catch (error) {
        console.error('error to refresh the token',error);
        throw error;
    }
};

