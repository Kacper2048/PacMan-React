import './App.css';
import React from "react";
import Sprite from "./SpriteComponent/Sprite.jsx";
import pacmanSprite from "./spritesPNG/PacMan.png"; // Import your sprite sheet
import BoardGenerator from './BoardComponent/BoardGenerator.jsx';
import Board from './BoardComponent/Board.jsx';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


function App() {
  return (
    <div className="App">
      <Board/>
    </div>
  );
}

export default App;