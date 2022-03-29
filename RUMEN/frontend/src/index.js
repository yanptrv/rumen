import React from 'react';
import {render} from 'react-dom';
import Chessboard from './components/Chessboard';
import JoinGame from './components/JoinGame';
import Home from './components/Home';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='' element={<Home/>}/>
                <Route path='join' element={<JoinGame/>}/>
                <Route path='join/:gameCode' element={<Chessboard/>}/>
            </Routes>
        </BrowserRouter>
    );
}

render(<App/>, document.getElementById('app'));
