import React from "react";
import {useRef, useState, useEffect} from 'react';
import Sprite from '../SpriteComponent/Sprite.jsx';
import pacman from '../spritesPNG/PacMan.png';
import './pacmanStyle.css';


/*

const Direction = Object.freeze({
    UP: 3,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 0
});

*/

const FPS = 17; //around 16 and 2/3ms
const SIZE = 50;
const ANIMATION_SPEED = 100;

export default function PacMan({children, tileSize, gameCycle, xCentrum, yCentrum, rotate, dir=0})
{
    let howManyFramesPerCycle = useRef(gameCycle/FPS);

    let [smoothProcess, setSmoothProcess] = useState(0);
    let ColPercOfProgress = useRef(0);
    let RowPercOfProgress = useRef(0);
    let timeOut = useRef(null);

    useEffect(()=>{

        timeOut.current = setTimeout(()=>{

            switch(dir)
            {
                case 0:
                    {
                        ColPercOfProgress.current = ColPercOfProgress.current+( parseFloat((tileSize/howManyFramesPerCycle.current).toFixed(1)) );
                    }
                break;

                case 1:
                    {
                        RowPercOfProgress.current = RowPercOfProgress.current + ( parseFloat((tileSize/howManyFramesPerCycle.current).toFixed(1)) );
                    }
                break;

                case 2:
                    {
                        ColPercOfProgress.current = ColPercOfProgress.current - ( parseFloat((tileSize/howManyFramesPerCycle.current).toFixed(1)) );
                    }
                break;

                case 3:
                    {
                        RowPercOfProgress.current = RowPercOfProgress.current - ( parseFloat((tileSize/howManyFramesPerCycle.current).toFixed(1)) );
                    }
                break;
            }
            setSmoothProcess((prev) => prev + 1);
        }, gameCycle/howManyFramesPerCycle.current);
        return ()=>{
            clearTimeout(timeOut.current);
        }
    },[smoothProcess])


    return(
    <div className="pacman" style={{transform: `translate(${ColPercOfProgress.current-25}px, ${RowPercOfProgress.current-25}px)`}}>
        <Sprite sprite={pacman} xCentrum={xCentrum} yCentrum={yCentrum} frameWidth={SIZE} frameHeight={SIZE} frameCount={3} speed={ANIMATION_SPEED} rotate={rotate} isRevert={true}/>
    </div>
    );
}