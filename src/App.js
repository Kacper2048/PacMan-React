import './App.css';
import React from "react";
import Sprite from "./SpriteComponent/Sprite.jsx";
import pacmanSprite from "./spritesPNG/PacMan.png"; // Import your sprite sheet
import BoardGenerator from './BoardComponent/BoardGenerator.jsx';
import BoardGe from './BoardComponent/Board.jsx';

function App() {
  return (
    <div className="App">
      <BoardGenerator/>
    </div>
  );
}

export default App;

/*
  <Sprite
        sprite={pacmanSprite}       // Path to the sprite sheet
        frameWidth={195}           // Width of each frame
        frameHeight={195}          // Height of each frame
        frameCount={3}             // Total number of frames
        speed={100}                // Speed of animation in milliseconds
        isRevert={true}
      />
*/