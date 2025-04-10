import React, { useState } from 'react'
import {AlbumSpotify} from '../types.ts/spotifydata'

export const ListAlbum :React.FC<{selectalbum: (idalbum:string)=>void}> = ({selectalbum}) => {

    const [albums,setalbums] = useState<AlbumSpotify[]>([]);
    const [filteredalbums,setfilteredalbums] = useState<AlbumSpotify[]>([]);
    const [loading,setloading] = useState(true);
    const [error,seterror] =useState<string | null>(null);
    const [search ,setsearch] = useState('');
    const [yearfilter,setyearfilter] = useState('');
    const [page,setpage] = useState(1);
    const itemsperpage = 5;

    
  return (
    <div>ListAlbum</div>
  )
}