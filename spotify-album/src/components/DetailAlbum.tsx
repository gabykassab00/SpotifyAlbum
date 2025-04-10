import React, { useEffect, useState } from 'react'
import {AlbumDetailsSpotify} from '../types.ts/spotifydata'
import {getdetailofalbum} from '../services/apispotify'
import {useNavigate, useParams} from 'react-router-dom'
export const DetailAlbum : React.FC = () => {
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
    <div className='album-details'>
        <button className='back-button' onClick={()=>navigate('/')}>
            Back to albums
        </button>
        <div className='album-card'>
            <div className='album-info'>
                <img 
                src={album?.images[0]?.url || ' placeholder.jpg'}
                alt={album?.name}
                className='album-image'
                />
            </div>
            <div className='album-description'>
                <h2 className='album-title'>{album?.name}</h2>
                <p className='album-release-date'><strong>release Date:</strong>{album?.release_date}</p>
                <p><strong>total tracks:</strong>{album?.total_tracks}</p>
                <p><strong>type:</strong>{album?.album_type}</p>
                <p><strong>popularity:</strong>{album?.popularity?? 'N/A'}</p>
            </div>
        </div>

        <h3 className='tracks-title'>Tracks</h3>
        <table className='tracks-table'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Duartion</th>
                    <th>Play</th>
                </tr>
            </thead>
            <tbody>
                {album?.tracks.items.map((track)=>(
                    <tr key={track.id}>
                        <td>{track.track_number}</td>
                        <td>{track.name}</td>
                        <td>
                            {Math.floor(track.duration_ms / 6000)}:
                            {((track.duration_ms % 60000 / 1000)/1000).toFixed(0).padStart(2,'0')}
                        </td>
                        <td>
                            {track.preview_url ? (
                                <button 
                                className='play-button'
                                onClick={()=>{
                                    const audio = new Audio(track.preview_url);
                                    audio.play();
                                }}
                                >
                                    play
                                </button>
                            ):(
                                <button className='no-preview-button' disabled>
                                    no preview
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

    </div>
  )
}