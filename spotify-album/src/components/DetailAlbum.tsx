import React, { useEffect, useState } from 'react'
import {AlbumDetailsSpotify} from '../types.ts/spotifydata'
import {getdetailofalbum} from '../services/apispotify'
import {useNavigate, useParams} from 'react-router-dom'
const DetailAlbum : React.FC = () => {
    const {idalbum} = useParams<{idalbum:string}>();
    const navigate = useNavigate();
    const [album,setalbum] = useState<AlbumDetailsSpotify | null>(null);
    const [loading,setloading] = useState(true);
    const [error,seterror] = useState<string | null>(null);


    useEffect(()=>{
        const fetchalbum = async () =>{
            if(!idalbum) return;
            setloading(true);
            try {
                const data = await getdetailofalbum(idalbum);
                setalbum(data);
            }catch(err){
                seterror('failed to get details of album');
            }
        }
        fetchalbum();
    },[idalbum]);
  return (
    <div>DetailAlbum</div>
  )
}