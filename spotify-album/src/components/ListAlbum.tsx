import React, { useState, useEffect } from 'react';
import { SpotifyAlbum } from '../types.ts/spotifydata';
import { getArtistAlbums, getAlbumDetails } from '../services/apispotify';
import '../components/Albumlist.css'; 

const AlbumsList: React.FC<{ onSelectAlbum: (albumId: string) => void }> = ({ onSelectAlbum }) => {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchAlbumsWithPopularity = async () => {
      setLoading(true);
      try {
        const initialData = await getArtistAlbums(0, 50);
        const batchSize = 5;
        const detailedData: SpotifyAlbum[] = [];

        for (let i = 0; i < initialData.length; i += batchSize) {
          const batch = initialData.slice(i, i + batchSize);
          const batchDetails = await Promise.all(
            batch.map(async (album) => {
              try {
                const details = await getAlbumDetails(album.id);
                return { ...album, popularity: details.popularity };
              } catch (err) {
                console.error(`Failed to fetch details for album ${album.id}:`, err);
                return { ...album, popularity: undefined };
              }
            })
          );
          detailedData.push(...batchDetails);
          if (i + batchSize < initialData.length) {
            await delay(1000);
          }
        }

        setAlbums(detailedData);
        setFilteredAlbums(detailedData);
      } catch (err) {
        setError('Failed to load albums.');
        console.error('Error in fetchAlbumsWithPopularity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumsWithPopularity();
  }, []);

  useEffect(() => {
    let filtered = albums;
    if (search) {
      filtered = filtered.filter((album) =>
        album.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (yearFilter) {
      filtered = filtered.filter((album) =>
        album.release_date.startsWith(yearFilter)
      );
    }
    setFilteredAlbums(filtered);
    setPage(1);
  }, [search, yearFilter, albums]);

  const years = Array.from(
    new Set(albums.map((album) => album.release_date.split('-')[0]))
  ).sort();

  const paginatedAlbums = filteredAlbums.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (filteredAlbums.length === 0 && !loading)
    return <div className="no-albums">No albums found.</div>;

  return (
    <div className="albums-list-container">
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search albums..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="year-filter"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="albums-table-wrapper">
        <table className="albums-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cover</th>
              <th>Name</th>
              <th>Release Date</th>
              <th>Tracks</th>
              <th>Type</th>
              <th>Popularity</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlbums.map((album, index) => (
              <tr
                key={album.id}
                className="album-row"
                onClick={() => onSelectAlbum(album.id)}
              >
                <td className="album-number">{(page - 1) * itemsPerPage + index + 1}</td>
                <td>
                  <img
                    src={album.images[2]?.url || 'placeholder.jpg'}
                    alt={album.name}
                    className="album-cover"
                  />
                </td>
                <td className="album-name">{album.name}</td>
                <td>{album.release_date}</td>
                <td>{album.total_tracks}</td>
                <td>{album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1)}</td>
                <td>{album.popularity ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`pagination-button ${page === i + 1 ? 'active' : ''}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlbumsList;