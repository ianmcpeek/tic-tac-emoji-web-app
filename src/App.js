import React, { useCallback, useRef } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import './App.css';
import Board from './views/board/Board';
import EmojiSelect from './views/emoji-select/EmojiSelect';
import Invite from './views/invite/Invite';
import Landing from './views/Landing/Landing';
import Lobby from './views/Lobby/Lobby';
import useWebsocketClient from './websocket-client/client';

function App() {
  // parse header for room code to see if should join room instead
  
// useEffect connection set
// new way to send messages back to server



  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='room' element={<Lobby />}></Route>
          <Route path='room/:id' element={<Lobby />}></Route>
          <Route index element={<Landing />}></Route>
          <Route path='select' element={<EmojiSelect />}></Route>
          <Route path='play' element={<Board />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
