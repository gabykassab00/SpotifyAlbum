import axios from 'axios';
import { SpotifyAlbum, SpotifyAlbumDetails } from '../types.ts/spotifydata';

const SPOTIFY_API_BASE = process.env.REACT_APP_SPOTIFY_API_BASE;
const TOKEN_REFRESH_URL = process.env.REACT_APP_TOKEN_REFRESH_URL;
const ARTIST_ID = process.env.REACT_APP_ARTIST_ID;
console.log('token'+process.env.REACT_APP_SPOTIFY_API_BASE); 

let ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const spotifyApi = axios.create({
  baseURL: SPOTIFY_API_BASE,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

const refreshAccessToken = async (): Promise<string> => {
  try {
    if (!TOKEN_REFRESH_URL) {
      throw new Error('TOKEN_REFRESH_URL is not defined');
    }
    const response = await axios.get(TOKEN_REFRESH_URL);
    const newToken = response.data.access_token; 
    if (!newToken) {
      throw new Error('No access token received from refresh endpoint');
    }
    ACCESS_TOKEN = newToken; 
    spotifyApi.defaults.headers.Authorization = `Bearer ${ACCESS_TOKEN}`; 
    console.log('Access token refreshed successfully:', newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

spotifyApi.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      try {
        await refreshAccessToken(); 
        return spotifyApi(originalRequest); 
      } catch (refreshError) {
        console.error('Failed to refresh token, logging out or redirecting to login:', refreshError);
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export const getArtistAlbums = async (
  offset: number = 0,
  limit: number = 15
): Promise<SpotifyAlbum[]> => {
  try {
    const response = await spotifyApi.get(`/artists/${ARTIST_ID}/albums`, {
      params: { offset, limit, include_groups: 'album,single' },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};

export const getAlbumDetails = async (albumId: string): Promise<SpotifyAlbumDetails> => {
  try {
    const response = await spotifyApi.get(`/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching album details:', error);
    throw error;
  }
};
