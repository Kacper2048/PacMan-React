import React from "react";
import { useState, useRef, useEffect } from "react";
import PacMan from "../PacManComponent/PacMan.jsx";
import Sprite from '../SpriteComponent/Sprite.jsx';
import pacmantexture from '../spritesPNG/PacMan.png';
import "./boardStyle.css";


const gameCycle = 150; //200ms

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
        this.isFreez = false;
    }

    setFreez(x)
    {
        this.isFreez = x;
    }

    getIsFreez()
    {
        let state = this.isFreez
        return state;
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
        if(!this.isFreez)
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
    let bigEvent = useRef(null);
    let points = useRef(0);
    let lives = useRef(3);

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
                bigEvent.current = Direction.UP;
            break;

            case "d":
                bigEvent.current =Direction.RIGHT;
            break;

            case "s":
                bigEvent.current =Direction.DOWN;
            break;

            case "a":
                bigEvent.current =Direction.LEFT;
            break;
        }
    }

    function generateLives() 
    {
        let tempArray = Array.from({ length: lives.current });
        
        return (
            <div className="pacManSpriteLives">
                {tempArray.map(() => {
                    return(
                    <div className="livesContainer">
                        <Sprite ColPercOfProgress={0} RowPercOfProgress={0} sprite={pacmantexture} xCentrum={1} yCentrum={0} frameWidth={30} frameHeight={30} frameCount={3} speed={0} rotate={0} isRevert={false}/>
                    </div>);
                })}
            </div>
        );
    }

    function renderBoard()
    {
        return( 
            <div className="Game">
                <div className="PointsAndLife">
                    <div>
                        <div>SCORE: {`${points.current}`}</div>
                        <div className="livesDiv">{generateLives()}</div>
                    </div>
                </div>

            <div className="board" tabIndex={0} onKeyDown={(event)=>getKey(event)}>
                {board.current.map( (element,row) => (
                    <div key={row} className="row">
                    {
                        element.map( (x,col) => 
                        {
                            return(
                                (row == pacManCharacter.current.getPos().posRow && col == pacManCharacter.current.getPos().posCol) ? 

                                <PacMan isFreez={pacManCharacter.current.getIsFreez()} tileSize={30} gameCycle ={gameCycle} xCentrum = {tileSize.current/2} yCentrum={tileSize.current/2} rotate={pacManCharacter.current.getAngleOfRotate()} dir={pacManCharacter.current.getDir()}/>
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

            <div className="menuButton">
                <div>
                    <div>MENU</div>
                </div>
            </div>


            </div>
            )
    }

    function isPointEaten({posRow,posCol})
    {
        if(board.current[posRow][posCol] == 1)
        {
            board.current[posRow][posCol]=0;
            points.current = points.current + 10;
        }
    }
    
    function checkCollisionWithWall({posRow,posCol},dir)
    {
        /*
        UP: 3,
        DOWN: 1,
        LEFT: 2,
        RIGHT: 0
        */
        switch(dir)
        {
            case 0:
                {
                    posCol++;
                }
            break;

            case 1:
                {
                    posRow++;
                }
            break;

            case 2:
                {
                    posCol--;
                }
            break;

            case 3:
                {
                    posRow--;
                }
            break;
        }

        if(board.current[posRow][posCol] < 0)
        {
            pacManCharacter.current.setFreez(true);
            return true;
        }
        else
        {
            pacManCharacter.current.setFreez(false);
            return false;
        }

    }
    
    function moveAllCharacter()
    {
        pacManCharacter.current.move();
    }

    function oneCycleOfGame()
    {
        setState((prev)=>prev+1);
        isPointEaten(pacManCharacter.current.getPos());

        moveAllCharacter();

        if(bigEvent.current != null)
        {
            pacManCharacter.current.changeDir(bigEvent.current);           
            bigEvent.current = null;
        }
        checkCollisionWithWall(pacManCharacter.current.getPos(), pacManCharacter.current.getDir());
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