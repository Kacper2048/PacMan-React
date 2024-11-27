import React from "react";
import { useState, useRef, useEffect } from "react";
import PacMan from "../PacManComponent/PacMan.jsx";

import "./boardStyle.css";


const gameCycle = 200; //200ms

const Direction = Object.freeze({
    UP: 3,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 0
});

class pacMan
{
    constructor(posRow, posCol, actDir=Direction.RIGHT) //LEFT is 0 degree of rotate "DOWN" 90 RIGHT 180 UP 270
    {
        this.posRow = posRow;
        this.posCol = posCol;
        this.actDir = actDir;
        this.angleOfRotate = ( this.actDir * 90) % 360;
    }

    getPos()
    {
        return { posRow: this.posRow, posCol: this.posCol};
    }

    setPos(posRow, posCol)
    {
        this.posRow = posRow;
        this.posCol = posCol;
    }

    changeDir(dir) //must be one of the Direction
    {
        this.actDir = dir;
        this.angleOfRotate = ( this.actDir * 90) % 360;
    }

    getDir()
    {
        let dir = this.actDir;
        return dir;
    }

    move()
    {
        switch(this.actDir)
        {
        case 0:
        {
        this.posCol = this.posCol + 1; 
        }
        break;
        case 1:
        {
            this.posRow = this.posRow + 1; 
        }
        break;
        case 2:
        {
            this.posCol = this.posCol -1; 
        }
        break;
        case 3:
        {
            this.posRow = this.posRow - 1; 
        }
        break;
        }
    }

    getAngleOfRotate()
    {
        return this.angleOfRotate;
    }
}

export default function Board({children})
{
    let tileSize = useRef(30);
    let [state, setState] = useState(0);
    let clock = useRef(null);

    let board = useRef(
        [
            [-7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5, -7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5],
            [-4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4],
            [-4, 1, -7, -6, -6, -5, 1, -7, -6, -6, -6, -5, 1, -4, -4, 1, -7, -6, -6, -6, -5, 1, -7, -6, -6, -5, 1, -4],
            [-4, 1, -4, 0, 0, -4, 1, -4, 0, 0, 0, -4, 1, -4, -4, 1, -4, 0, 0, 0, -4, 1, -4, 0, 0, -4, 1, -4],
            [-4, 1, -2, -6, -6, -3, 1, -2, -6, -6, -6, -3, 1, -2, -3, 1, -2, -6, -6, -6, -3, 1, -2, -6, -6, -3, 1, -4],
            [-4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4],
            [-4, 1, -7, -6, -6, -5, 1, -7, -5, 1, -7, -6, -6, -6, -6, -6, -6, -5, 1, -7, -5, 1, -7, -6, -6, -5, 1, -4],
            [-4, 1, -2, -6, -6, -3, 1, -4, -4, 1, -2, -6, -6, -5, -7, -6, -6, -3, 1, -4, -4, 1, -2, -6, -6, -3, 1, -4],
            [-4, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, -4],
            [-2, -6, -6, -6, -6, -5, 1, -4, -2, -6, -6, -5, 0, -4, -4, 0, -7, -6, -6, -3, -4, 1, -7, -6, -6, -6, -6, -3],
            [0, 0, 0, 0, 0, -4, 1, -4, -7, -6, -6, -3, 0, -2, -3, 0, -2, -6, -6, -5, -4, 1, -4, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, -4, 1, -4, -4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, -4, 1, -4, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, -4, 1, -4, -4, 0, -7, -6, -6, 3, 3, -6, -6, -5, 0, -4, -4, 1, -4, 0, 0, 0, 0, 0],
            [-7, -6, -6, -6, -6, -3, 1, -2, -3, 0, -4, 0, 0, 0, 0, 0, 0, -4, 0, -2, -3, 1, -2, -6, -6, -6, -6, -5],
            [-4, 0, 0, 0, 0, 0, 1, 0, 0, 0, -4, 0, 0, 0, 0, 0, 0, -4, 0, 0, 0, 1, 0, 0, 0, 0, 0, -4],
            [-2, -6, -6, -6, -6, -5, 1, -7, -5, 0, -4, 0, 0, 0, 0, 0, 0, -4, 0, -7, -5, 1, -7, -6, -6, -6, -6, -3],
            [0, 0, 0, 0, 0, -4, 1, -4, -4, 0, -2, -6, -6, -6, -6, -6, -6, -3, 0, -4, -4, 1, -4, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, -4, 1, -4, -4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, -4, 1, -4, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, -4, 1, -4, -4, 0, -7, -6, -6, -6, -6, -6, -6, -5, 0, -4, -4, 1, -4, 0, 0, 0, 0, 0],
            [-7, -6, -6, -6, -6, -3, 1, -2, -3, 0, -2, -6, -6, -5, -7, -6, -6, -3, 0, -2, -3, 1, -2, -6, -6, -6, -6, -5],
            [-4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4],
            [-4, 1, -7, -6, -6, -5, 1, -7, -6, -6, -6, -5, 1, -4, -4, 1, -7, -6, -6, -6, -5, 1, -7, -6, -6, -5, 1, -4],
            [-4, 1, -2, -6, -5, -4, 1, -2, -6, -6, -6, -3, 1, -2, -3, 1, -2, -6, -6, -6, -3, 1, -4, -7, -6, -3, 1, -4],
            [-4, 1, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 1, -4],
            [-2, -6, -5, 1, -4, -4, 1, -7, -5, 1, -7, -6, -6, -6, -6, -6, -6, -5, 1, -7, -5, 1, -4, -4, 1, -7, -6, -3],
            [-7, -6, -3, 1, -2, -3, 1, -4, -4, 1, -2, -6, -6, -5, -7, -6, -6, -3, 1, -4, -4, 1, -2, -3, 1, -2, -6, -5],
            [-4, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, -4],
            [-4, 1, -7, -6, -6, -6, -6, -3, -2, -6, -6, -5, 1, -4, -4, 1, -7, -6, -6, -3, -2, -6, -6, -6, -6, -5, 1, -4],
            [-4, 1, -2, -6, -6, -6, -6, -6, -6, -6, -6, -3, 1, -2, -3, 1, -2, -6, -6, -6, -6, -6, -6, -6, -6, -3, 1, -4],
            [-4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4],
            [-2, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -3]
        ]
    );

    let styleArray = useRef(
        { 
            '-7': 'downrightcorner', 
            '-6': 'horizontal', 
            '-5': 'leftdowncorner', 
            '-4': 'vertical', 
            '-3': 'topleftcorner', 
            '-2': 'righttopcorner',
            '-1': 'wall',
            '0':'emptySpace',
            '1':'smallPellet', 
            '2':'bigPellet', 
            '3':'ghostWall'
        }
    );

    let pacManCharacter = useRef(
        new pacMan(23,14,Direction.RIGHT)
    )

    function setNewValue(row,col,val) //style is tied with value of the tile and it is asigned during rendering
    {
        board.current[row][col] = val;
    }
    
    function getKey(event)
    {
        let key = event.key.toLowerCase();
        switch(key)
        {
            case "w":
            pacManCharacter.current.changeDir(Direction.UP)
            break;

            case "d":
            pacManCharacter.current.changeDir(Direction.RIGHT)
            break;

            case "s":
            pacManCharacter.current.changeDir(Direction.DOWN)
            break;

            case "a":
            pacManCharacter.current.changeDir(Direction.LEFT)
            break;
        }
    }

    function renderBoard()
    {
        return( 
            <div className="board" tabIndex={0} onKeyDown={(event)=>getKey(event)}>
                {board.current.map( (element,row) => (
                    <div key={row} className="row">
                    {
                        element.map( (x,col) => 
                        {
                            return(
                                (row == pacManCharacter.current.getPos().posRow && col == pacManCharacter.current.getPos().posCol) ? 
                                <div>
                                <PacMan tileSize={50} gameCycle ={gameCycle} xCentrum = {tileSize.current/2} yCentrum={tileSize.current/2} rotate={pacManCharacter.current.getAngleOfRotate()} dir={pacManCharacter.current.getDir()}/>
                                    <div  className={"tile " + styleArray.current[`${board.current[row][col]}`]} key={`${row}-${col}`}>
                                    </div>
                                </div>
                                : 
                                <div  className={"tile " + styleArray.current[`${board.current[row][col]}`]} key={`${row}-${col}`}>
                                </div>
                            );
                        }
                        )
                    }   
                    </div>
                )
                )
                }
            </div>
            )
    }

    function moveAllCharacter()
    {
        //pacManCharacter.current.move();
        console.log(pacManCharacter.current.getPos())
    }

    function oneCycleOfGame()
    {
        setState((prev)=>prev+1);
        moveAllCharacter();
    }

    useEffect( //set clock
        ()=>
        {
            clock.current = setTimeout(()=>oneCycleOfGame(), gameCycle);
            return () => { //cleanup
            clearInterval(clock.current);
            }
        }
        
        ,[state]);

    return (
        <>
            {renderBoard()}
        </>
    );
}