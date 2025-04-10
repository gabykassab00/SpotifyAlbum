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

    useEffect(()=>{
        let filtered = albums;

        if(search){
            filtered = filtered.filter((album)=>
            album.name.toLowerCase().includes(search.toLowerCase()))
        }
        if(yearfilter){
            filtered = filtered.filter((album)=>(
                album.release_date.startsWith(yearfilter)
            ))
        }
        setfilteredalbums(filtered);
        setpage(1);
    },[search,yearfilter,albums]);

    const years = Array.from(
        new Set(albums.map((album)=>album.release_date.split('-')[0]))
    ).sort();

    const paginatedAlbums = filteredalbums.slice(
        (page-1) * itemsperpage,
        page * itemsperpage
    )
    
    const totalpages = Math.ceil(filteredalbums.length / itemsperpage);

  return (
    <div className='albums-list-container'>
        <div className='filters'>
            <input 
            type='text'
            className='search-input'
            placeholder='search albums...'
            value={search}
            onChange={(e)=>setsearch(e.target.value)}
            />
            <select className='year-filter'
            value={yearfilter}
            onChange={(e)=>setyearfilter(e.target.value)}
            >
                <option value="">All Years</option>
                {years.map((year)=>(
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
        <div className='albums-table-wrapper'>
            <table className='albums-table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>cover</th>
                        <th>name</th>
                        <th>release date</th>
                        <th>tracks</th>
                        <th>type</th>
                        <th>popularity</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedAlbums.map((albums,index)=>(
                        <tr 
                        key={albums.id}
                        className='album-row'
                        onClick={()=>selectalbum(albums.id)}
                        >
                            <td className='album-number'>{(page-1) * itemsperpage+index+1}</td>
                            <td>
                                <img 
                                src={albums.images[2]?.url || 'placeholder.jpg'}
                                alt={albums.name}
                                className='album-cover'
                                />
                            </td>
                            <td className='album-name'>{albums.name}</td>
                            <td>{albums.release_date}</td>
                            <td>{albums.total_tracks}</td>
                            <td>{albums.album_type.charAt(0).toUpperCase() + albums.album_type.slice(1)}</td>
                            <td>{albums.popularity ?? 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className='pagination'>
            {Array.from({length:totalpages},(_,i)=>(
                <button 
                key={i}
                className={`pagination-button ${page === i + 1 ? 'active':''}`}
                onClick={()=>setpage(i+1)}
                >
                    {i+1}
                </button>
            ))}
        </div>
    </div>
  )
}