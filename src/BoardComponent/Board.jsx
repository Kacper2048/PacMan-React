import React from "react";
import { useState, useRef, useEffect } from "react";
import PacMan from "../PacManComponent/PacMan.jsx";
import Sprite from '../SpriteComponent/Sprite.jsx';
import pacmantexture from '../spritesPNG/PacMan.png';
import Ghost from '../GhostComponent/Ghost.jsx';

import "./boardStyle.css";
import PathFinderBTS from "../GhostComponent/PathFinder.js";


const gameCycle = 150; //150ms

const Direction = Object({
    UP: 3,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 0
});

const GameState = Object({
    LOSE: -1,
    START: 0,
    RUN: 1,
    WIN: 2
});


const directionMap = {
    "1,0": Direction.DOWN,
    "-1,0": Direction.UP,
    "0,-1": Direction.LEFT,
    "0,1": Direction.RIGHT
};

class Character {
    constructor(posRow, posCol, actDir = Direction.RIGHT) //LEFT is 0 degree of rotate "DOWN" 90 RIGHT 180 UP 270
    {
        this.posRow = posRow;
        this.posCol = posCol;
        this.actDir = actDir;
        this.angleOfRotate = (this.actDir * 90) % 360;
        this.isFreez = false;
    }

    setFreez(x) {
        this.isFreez = x;
    }

    getIsFreez() {
        let state = this.isFreez
        return state;
    }

    getPos() {
        return { posRow: this.posRow, posCol: this.posCol };
    }

    setPos(posRow, posCol) {
        this.posRow = posRow;
        this.posCol = posCol;
    }

    changeDir(dir) //must be one of the Direction
    {
        this.actDir = dir;
        this.angleOfRotate = (this.actDir * 90) % 360;
    }

    getDir() {
        let dir = this.actDir;
        return dir;
    }

    move() {
        if (!this.isFreez) {
            switch (this.actDir) {
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
                        this.posCol = this.posCol - 1;
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

    getRandomFromAvaiable(arr) {
        let temp;

        do {
            temp = arr[Math.floor(Math.random() * arr.length)]; //random index with pos

        } while (temp.row == this.posRow && temp.col == this.posCol)

        return temp;
    }

    moveWithAutopilot(btsFinder, arr) //arr is a array with all avaiable places to put character
    {

        //if (!this.isFreez) 
        {
            if (this.#arrayWithCommand.length == 0) {
                do {
                    this.generateNewCommands(btsFinder.doYouKnowTheWay({ row: this.posRow, col: this.posCol }, { row: this.getRandomFromAvaiable([...arr]).row, col: this.getRandomFromAvaiable([...arr]).col }));
                    console.log("try")
                } while (this.#arrayWithCommand.length < 5)
                console.log(`@len: ${this.#arrayWithCommand.length}:`);
            }
            this.changeDir(this.#arrayWithCommand.shift()) //change dir for first element in array with commands

            switch (this.actDir) {
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
                        this.posCol = this.posCol - 1;
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

    generateNewCommands(arrayOfPos) // run when collision event occur - get new set of pos where to go [{pos,col}, ..., {pos,col}]
    {
        let newPos = null;
        let oldPos = null;
        let vector = { row: 0, col: 0 }
        let dirLocal = null

        arrayOfPos.map((pos) => {
            oldPos = newPos;
            newPos = pos;

            if (oldPos != null) {
                vector.row = newPos.row - oldPos.row;
                vector.col = newPos.col - oldPos.col;

                dirLocal = directionMap[`${vector.row},${vector.col}`];
                this.#arrayWithCommand.push(dirLocal);
            }
        })
    }

    getAngleOfRotate() {
        return this.angleOfRotate;
    }

    #arrayWithCommand = []; //contain list of direction of move translated from pathFinder
}

export default function Board({ children }) {
    let tileSize = useRef(30);
    let [state, setState] = useState(0);
    let clock = useRef(null);
    let bigEvent = useRef(null);
    let points = useRef(0);
    let lives = useRef(3);
    let gameState = useRef(GameState.RUN);

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

    let avaiablePlces = useRef(
        board.current.flatMap((row, rowID) =>
            row
                .map((square, colID) => (square >= 0 ? { row: rowID, col: colID } : null))
                .filter((item) => item !== null)
        )
    )

    let howManyPelets = useRef(board.current.reduce((total, element)=>{ return total = total + element.filter((square) => square == 1).length}, 0))

    let styleArray = useRef(
        {
            '-7': 'downrightcorner',
            '-6': 'horizontal',
            '-5': 'leftdowncorner',
            '-4': 'vertical',
            '-3': 'topleftcorner',
            '-2': 'righttopcorner',
            '-1': 'wall',
            '0': 'emptySpace',
            '1': 'smallPellet',
            '2': 'bigPellet',
            '3': 'ghostWall'
        }
    );

    let pacManCharacter = useRef(
        new Character(23, 14, Direction.RIGHT)
    )

    let redGhostCharacter = useRef(new Character(11, 13, Direction.UP));

    let btsFinder = useRef(new PathFinderBTS(board.current, 32, 28));


    function setNewValue(row, col, val) //style is tied with value of the tile and it is asigned during rendering
    {
        board.current[row][col] = val;
    }

    function getKey(event) {
        let key = event.key.toLowerCase();
        switch (key) {
            case "w":
                bigEvent.current = Direction.UP;
                break;

            case "d":
                bigEvent.current = Direction.RIGHT;
                break;

            case "s":
                bigEvent.current = Direction.DOWN;
                break;

            case "a":
                bigEvent.current = Direction.LEFT;
                break;
        }
    }

    function generateLives() {
        let tempArray = Array.from({ length: lives.current });

        return (
            <div className="pacManSpriteLives">
                {tempArray.map(() => {
                    return (
                        <div className="livesContainer">
                            <Sprite ColPercOfProgress={0} RowPercOfProgress={0} sprite={pacmantexture} xCentrum={1} yCentrum={0} frameWidth={30} frameHeight={30} frameCount={3} speed={0} rotate={0} isRevert={false} />
                        </div>);
                })}
            </div>
        );
    }

    function renderBoard() {
        return (
            <div className="Game">
                <div className="PointsAndLife">
                    <div>
                        <div>SCORE: {`${points.current}`}</div>
                        <div className="livesDiv">{generateLives()}</div>
                    </div>
                </div>

                <div className="board" tabIndex={0} onKeyDown={(event) => getKey(event)}>
                    {board.current.map((element, row) => (
                        <div key={row} className="row">
                            {
                                element.map((x, col) => {


                                    {
                                        if (row == pacManCharacter.current.getPos().posRow && col == pacManCharacter.current.getPos().posCol)
                                            return (<PacMan isFreez={pacManCharacter.current.getIsFreez()} tileSize={30} gameCycle={gameCycle} xCentrum={tileSize.current / 2} yCentrum={tileSize.current / 2} rotate={pacManCharacter.current.getAngleOfRotate()} dir={pacManCharacter.current.getDir()} />)
                                        else if (row == redGhostCharacter.current.getPos().posRow && col == redGhostCharacter.current.getPos().posCol)
                                            return (<Ghost isFreez={redGhostCharacter.current.getIsFreez()} tileSize={30} gameCycle={gameCycle} xCentrum={tileSize.current / 2} yCentrum={tileSize.current / 2} rotate={redGhostCharacter.current.getAngleOfRotate()} dir={redGhostCharacter.current.getDir()} />)
                                        else
                                            return (<div className={"tile " + styleArray.current[`${board.current[row][col]}`]} key={`${row}-${col}`}>
                                            </div>)
                                    }

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

    function isPointEaten({ posRow, posCol }) 
    {
        if (board.current[posRow][posCol] == 1) {
            board.current[posRow][posCol] = 0;
            points.current = points.current + 10;
            howManyPelets.current--;
            console.log("left pelefts: " + howManyPelets.current)
            if(howManyPelets.current == 0)
            {
                endOfGame(GameState.WIN);
            }
        }
    }

    function endOfGame(status)
    {
        gameState.current = status;
        pacManCharacter.current.setFreez(true);
        redGhostCharacter.current.setFreez(true);
    }

    function ghostCollisionWithWall({ posRow, posCol }, dir) {
        switch (dir) {
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

        if (board.current[posRow][posCol] < 0) {
            let randomNumber = Math.floor(Math.random() * 4);
            //redGhostCharacter.current.changeDir(randomNumber);
            redGhostCharacter.current.setFreez(true);
        }
        else {
            redGhostCharacter.current.setFreez(false);
            return false;
        }
    }

    function checkCollisionWithWall({ posRow, posCol }, dir) {
        /*
        UP: 3,
        DOWN: 1,
        LEFT: 2,
        RIGHT: 0
        */
        switch (dir) {
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

        if (board.current[posRow][posCol] < 0) {
            pacManCharacter.current.setFreez(true);
            return true;
        }
        else {
            pacManCharacter.current.setFreez(false);
            return false;
        }

    }

    function checkCollisionWithPacMan(GhostPos, GhostDir, PacManPos)
    {
        switch (GhostDir) {
            case 0:
                {
                    GhostPos.posCol++;
                }
                break;

            case 1:
                {
                    GhostPos.posRow++;
                }
                break;

            case 2:
                {
                    GhostPos.posCol--;
                }
                break;

            case 3:
                {
                    GhostPos.posRow--;
                }
                break;
        }

        if(GhostPos.posRow == PacManPos.posRow && GhostPos.posCol == PacManPos.posCol)
        {
            endOfGame( GameState.LOSE);

            return true;
        }
        return false
    }

    function moveAllCharacter() {
        pacManCharacter.current.move();
        redGhostCharacter.current.moveWithAutopilot(btsFinder.current, avaiablePlces.current); //if freeze it will not move
        //redGhostCharacter.current.move(); //if freeze it will not move
    }

    function oneCycleOfGame() {
    
        if(gameState.current == GameState.RUN)
        {
            setState((prev) => prev + 1);
            isPointEaten(pacManCharacter.current.getPos());
            moveAllCharacter();

            if (bigEvent.current != null) {
                pacManCharacter.current.changeDir(bigEvent.current);
                bigEvent.current = null;
            }
            checkCollisionWithWall(pacManCharacter.current.getPos(), pacManCharacter.current.getDir());
            ghostCollisionWithWall(redGhostCharacter.current.getPos(), redGhostCharacter.current.getDir());
            checkCollisionWithPacMan(redGhostCharacter.current.getPos(), redGhostCharacter.current.getDir(), pacManCharacter.current.getPos())
        }
    }

    useEffect( //set clock
        () => {
            clock.current = setTimeout(() => oneCycleOfGame(), gameCycle);

            return () => { //cleanup
                clearInterval(clock.current);
            }
        }

        , [state]);

    return (
        <>
            {renderBoard()}
        </>
    );
}