import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AlbumsList from './components/ListAlbum';
import AlbumDetails from './components/DetailAlbum';

function App() {
  return (
    <Router>
      <div className="container mt-4">
      <h1 style={{color:'white'}}>Beyoncé</h1>
        <Routes>
          <Route
            path="/"
            element={<AlbumsList onSelectAlbum={(albumId) => window.location.href = `/album/${albumId}`} />}
          />
          <Route path="/album/:albumId" element={<AlbumDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;