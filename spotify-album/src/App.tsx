import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import {ListAlbum} from '../src/components/ListAlbum'
import {DetailAlbum} from '../src/components/DetailAlbum'

function App(){
  return (
    <Router>
    <div className='container mt-4'>
      <h1 style={{color:'white'}}>Beyoncé</h1>
      <Routes>
        <Route 
        path='/'
        element={<ListAlbum  selectalbum={(albumid)=>window.location.href = `/album/${albumid}`}/>}
        />
        <Route path='/album/:albumId' element={<DetailAlbum/>}/>
      </Routes>
    </div>
    </Router>
  )
}

export default App
