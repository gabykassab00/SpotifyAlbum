import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SpotifyAlbumDetails } from '../services/apispotify';
import { getAlbumDetails } from '../services/apispotify';
import './AlbumDetails.css'; 

const AlbumDetails: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<SpotifyAlbumDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!albumId) return;
      setLoading(true);
      try {
        const data = await getAlbumDetails(albumId);
        setAlbum(data);
      } catch (err) {
        setError('Failed to load album details.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!album) return <div className="info">Album not found.</div>;

  return (
    <div className="album-details">
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Albums
      </button>
      <div className="album-card">
        <div className="album-info">
          <img
            src={album.images[0]?.url || 'placeholder.jpg'}
            alt={album.name}
            className="album-image"
          />
          <div className="album-description">
            <h2 className="album-title">{album.name}</h2>
            <p className="album-release-date"><strong>Release Date:</strong> {album.release_date}</p>
            <p><strong>Total Tracks:</strong> {album.total_tracks}</p>
            <p><strong>Type:</strong> {album.album_type}</p>
            <p><strong>Popularity:</strong> {album.popularity ?? 'N/A'}</p>
          </div>
        </div>
        <h3 className="tracks-title">Tracks</h3>
        <table className="tracks-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Duration</th>
              <th>Play</th>
            </tr>
          </thead>
          <tbody>
            {album.tracks.items.map((track:any) => (
              <tr key={track.id}>
                <td>{track.track_number}</td>
                <td>{track.name}</td>
                <td>
                  {Math.floor(track.duration_ms / 60000)}:
                  {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                </td>
                <td>
                  {track.preview_url ? (
                    <button
                      className="play-button"
                      onClick={() => {
                        const audio = new Audio(track.preview_url);
                        audio.play();
                      }}
                    >
                      Play
                    </button>
                  ) : (
                    <button className="no-preview-button" disabled>
                      No Preview
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlbumDetails;