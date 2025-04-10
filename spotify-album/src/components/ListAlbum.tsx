import React, { useEffect, useState } from 'react'
import {AlbumSpotify} from '../types.ts/spotifydata'
import { resolve } from 'path';
import { getalbumofartist ,getdetailofalbum} from '../services/apispotify';

export const ListAlbum :React.FC<{selectalbum: (idalbum:string)=>void}> = ({selectalbum}) => {

    const [albums,setalbums] = useState<AlbumSpotify[]>([]);
    const [filteredalbums,setfilteredalbums] = useState<AlbumSpotify[]>([]);
    const [loading,setloading] = useState(true);
    const [error,seterror] =useState<string | null>(null);
    const [search ,setsearch] = useState('');
    const [yearfilter,setyearfilter] = useState('');
    const [page,setpage] = useState(1);
    const itemsperpage = 5;


    const delay = (ms:number)=> new Promise(resolve=>setTimeout(resolve,ms));

    useEffect(()=>{
        const fetchalbumswithpopularity = async ()=>{
            setloading(true);

            try {
                const initialdata = await getalbumofartist(0,50);
                const batchsize =5;
                const detaileddata : AlbumSpotify[] = [];

                for (let i = 0; i<initialdata.length; i += batchsize){
                    const batch = initialdata.slice(i,i+batchsize);
                    const batchdetails = await Promise.all(
                        batch.map(async(album)=>{
                            try {
                                const details = await getdetailofalbum(album.id);
                                return {...album,popularity:details.popularity};
                            } catch(err){
                                return {...album,popularity:undefined};
                            }
                        })
                    )
                    detaileddata.push(...batchdetails);
                    if(i+batchsize < initialdata.length){
                        await delay(1000);
                    }
                }
                setalbums(detaileddata);
                setfilteredalbums(detaileddata);
            } catch(err){
                seterror('failed to load the albums');
            }
        }
        fetchalbumswithpopularity();
    },[]);
    
  return (
    <div>ListAlbum</div>
  )
}