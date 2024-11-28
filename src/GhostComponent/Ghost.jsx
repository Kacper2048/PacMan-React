import React from "react";
import {useRef, useState, useEffect} from 'react';
import Sprite from '../SpriteComponent/Sprite.jsx';
import redGhost from '../spritesPNG/red-ghost-210.png';
import './ghostStyle.css';


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
const ANIMATION_SPEED = 125;

export default function Ghost({children, isFreez, tileSize, gameCycle, xCentrum, yCentrum, rotate,dir=0})
{
    let howManyFramesPerCycle = useRef(gameCycle/FPS);

    let [smoothProcess, setSmoothProcess] = useState(0);
    let ColPercOfProgress = useRef(0);
    let RowPercOfProgress = useRef(0);
    let timeOut = useRef(null);

    useEffect(()=>{
        
        if(!isFreez)
        {
            RowPercOfProgress.current = RowPercOfProgress.current % tileSize; //that two lines delete that funy error
            ColPercOfProgress.current = ColPercOfProgress.current % tileSize;
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
        }
        return ()=>{
            clearTimeout(timeOut.current);
        }
    },[smoothProcess])

    function offsetFun()
    {
        switch(dir)
        {
            case 0: //right
                {
                   return(
                    <Sprite ColPercOfProgress={ColPercOfProgress.current}
                        RowPercOfProgress={RowPercOfProgress.current} 
                        sprite={redGhost}
                        xCentrum={xCentrum} 
                        yCentrum={yCentrum} 
                        frameWidth={SIZE} 
                        frameHeight={SIZE} 
                        frameCount={8} 
                        speed={ANIMATION_SPEED} 
                        rotate={0} 
                        isRevert={false}
                        offset={0}
                        howMuch={2}
                    />)
                }
            break;

            case 1: //down
                {
                    return(
                        <Sprite ColPercOfProgress={ColPercOfProgress.current}
                            RowPercOfProgress={RowPercOfProgress.current} 
                            sprite={redGhost} 
                            xCentrum={xCentrum} 
                            yCentrum={yCentrum} 
                            frameWidth={SIZE} 
                            frameHeight={SIZE} 
                            frameCount={8} 
                            speed={ANIMATION_SPEED} 
                            rotate={0} 
                            isRevert={false}
                            offset={2}
                            howMuch={2}
                        />) 
                }
            break;

            case 2: //left
                {
                    return(
                        <Sprite ColPercOfProgress={ColPercOfProgress.current}
                            RowPercOfProgress={RowPercOfProgress.current} 
                            sprite={redGhost} 
                            xCentrum={xCentrum} 
                            yCentrum={yCentrum} 
                            frameWidth={SIZE} 
                            frameHeight={SIZE} 
                            frameCount={8} 
                            speed={ANIMATION_SPEED} 
                            rotate={0} 
                            isRevert={false}
                            offset={4}
                            howMuch={2}
                        />)
                }
            break;

            case 3: //up
                {
                    return(
                        <Sprite ColPercOfProgress={ColPercOfProgress.current}
                            RowPercOfProgress={RowPercOfProgress.current} 
                            sprite={redGhost} 
                            xCentrum={xCentrum} 
                            yCentrum={yCentrum} 
                            frameWidth={SIZE} 
                            frameHeight={SIZE} 
                            frameCount={8} 
                            speed={ANIMATION_SPEED} 
                            rotate={0} 
                            isRevert={false}
                            offset={6}
                            howMuch={2}
                        />)
                }
            break;
        }
    }
    return(
    <div className="ghost">
        {offsetFun()}
    </div>
    );
}