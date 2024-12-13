import React from "react";
import { useState, useRef, useEffect } from "react";
import PacMan from "../PacManComponent/PacMan.jsx";
import Sprite from '../SpriteComponent/Sprite.jsx';
import pacmantexture from '../spritesPNG/PacMan.png';
import Ghost from '../GhostComponent/Ghost.jsx';

import "./boardStyle.css";
import PathFinderBTS from "../GhostComponent/PathFinder.js";

import redGhost from '../spritesPNG/red-ghost-210.png';
import orangeGhost from '../spritesPNG/orange-ghost-210.png';
import pinkGhost from '../spritesPNG/pink-ghost-210.png';
import cyanGhost from '../spritesPNG/cyan-ghost-210.png';
import eatableGhost from '../spritesPNG/eatable-ghost-210.png';
import skull from '../spritesPNG/skull.png';

import winPic from '../spritesPNG/win.png';
import losePic from '../spritesPNG/lose.png';
import Button from '../ButtonComponent/Button.jsx'

import useSound from 'use-sound';
import eatGhost from '../sounds/eatGhost.mp3';
import PacManWalk from '../sounds/move.mp3';
import dead1 from '../sounds/dead1.mp3';
import dead2 from '../sounds/dead2.mp3';
import dead3 from '../sounds/dead3.mp3';
import vixa from '../sounds/vixa.mp3';
import win from '../sounds/win.mp3';

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
    WIN: 2,
    DEAD: 3
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
        this.#arrayWithCommand = []
        this.isFreez = false;
    }

    isEatable() {
        return this.#eatable;
    }

    setEatable(val) {
        this.#eatable = val;
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

    setTarget(targetPos, btsFinder) // object posRow;posCol
    {
        this.#arrayWithCommand = [];
        this.generateNewCommands(btsFinder.doYouKnowTheWay({ row: this.posRow, col: this.posCol }, { row: targetPos.posRow, col: targetPos.posCol }));
        console.log(`Return to home @len: ${this.#arrayWithCommand.length}:`);
    }


    changeDir(dir) //must be one of the Direction
    {
        if(dir != undefined)
        {
            this.actDir = dir;
            this.angleOfRotate = (this.actDir * 90) % 360;
        }
        else
        {
            this.actDir = undefined; 
        }
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
                default:
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

        if (this.#arrayWithCommand.length == 0) {

            if (this.#airState == true) 
            {
                this.#airState = false;
                this.#eatable = false;
            }

            do 
            {
                this.generateNewCommands(btsFinder.doYouKnowTheWay(
                    { row: this.posRow, col: this.posCol },
                    { row: this.getRandomFromAvaiable([...arr]).row, col: this.getRandomFromAvaiable([...arr]).col })
                );
                
            } while (this.#arrayWithCommand.length < 5)

            this.changeDir(undefined)
        }
        this.move();
        this.changeDir(this.#arrayWithCommand.shift()) //change dir for first element in array with commands
        
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

    isAirState() {
        return this.#airState;
    }

    setAirState(val) {
        this.#airState = val;
    }

    #arrayWithCommand = []; //contain list of direction of move translated from pathFinder
    #eatable = false;
    #airState = false;
}

export default function Board({ children }) {
    let tileSize = useRef(30);
    let [state, setState] = useState(0);
    let clock = useRef(null);
    let bigEvent = useRef(null);
    let points = useRef(0);
    let lives = useRef(3);
    let gameState = useRef(GameState.RUN);
    let timeoutEatable = useRef(null);
    let isBigPelletEaten = useRef(null);
    let combo = useRef(0);
    let waitDead = useRef(null);
    let makeSoundMovePacManTimer = useRef(1000);

    let isPopUpMenuShow = useRef(false);

    //sound block   
    let [consumptionOfGhost, { stopConsumptionOfGhost }] = useSound(eatGhost);
    let [makeSoundMovePacMan, objControlMoveSoundPacMan] = useSound(PacManWalk);
    let [makeSoundDead1, objControlmakeSoundDead1] = useSound(dead1);
    let [makeSoundDead2, objControlmakeSoundDead2] = useSound(dead2);
    let [makeSoundDead3, objControlmakeSoundDead3] = useSound(dead3);
    let [makeSoundVixa, objControlmakeVixa] = useSound(vixa);
    let [makeSoundWin, objControlmakeWin] = useSound(win);


    let ifMoveSoundPacMan = useRef(false);

    let board = useRef(
        [[-7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5, -7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5],
[-4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4],
[-4, 1, -7, -6, -6, -5, 1, -7, -6, -6, -6, -5, 1, -4, -4, 1, -7, -6, -6, -6, -5, 1, -7, -6, -6, -5, 1, -4],
[-4, 2, -4, 0, 0, -4, 1, -4, 0, 0, 0, -4, 1, -4, -4, 1, -4, 0, 0, 0, -4, 1, -4, 0, 0, -4, 2, -4],
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
[-4, 2, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 2, -4],
[-2, -6, -5, 1, -4, -4, 1, -7, -5, 1, -7, -6, -6, -6, -6, -6, -6, -5, 1, -7, -5, 1, -4, -4, 1, -7, -6, -3],
[-7, -6, -3, 1, -2, -3, 1, -4, -4, 1, -2, -6, -6, -5, -7, -6, -6, -3, 1, -4, -4, 1, -2, -3, 1, -2, -6, -5],
[-4, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, -4],
[-4, 1, -7, -6, -6, -6, -6, -3, -2, -6, -6, -5, 1, -4, -4, 1, -7, -6, -6, -3, -2, -6, -6, -6, -6, -5, 1, -4],
[-4, 1, -2, -6, -6, -6, -6, -6, -6, -6, -6, -3, 1, -2, -3, 1, -2, -6, -6, -6, -6, -6, -6, -6, -6, -3, 1, -4],
[-4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4],
[-2, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -3]
]
    );

    let boardCopy = useRef(
        [[-7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5, -7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5],
        [-4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4],
        [-4, 1, -7, -6, -6, -5, 1, -7, -6, -6, -6, -5, 1, -4, -4, 1, -7, -6, -6, -6, -5, 1, -7, -6, -6, -5, 1, -4],
        [-4, 2, -4, 0, 0, -4, 1, -4, 0, 0, 0, -4, 1, -4, -4, 1, -4, 0, 0, 0, -4, 1, -4, 0, 0, -4, 2, -4],
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
        [-4, 2, 1, 1, -4, -4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -4, -4, 1, 1, 2, -4],
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

    let howManyPelets = useRef(board.current.reduce((total, element) => { return total = total + element.filter((square) => square == 1).length }, 0))

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

    let redGhostCharacter = useRef(new Character(13, 13, Direction.UP));
    let orangeGhostCharacter = useRef(new Character(15, 11, Direction.UP));
    let pinkGhostCharacter = useRef(new Character(15, 14, Direction.UP));
    let cyanGhostCharacter = useRef(new Character(15, 16, Direction.UP));

    let btsFinder = useRef(new PathFinderBTS(board.current, 32, 28));

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

    function isPointEaten({ posRow, posCol }) {
        if (board.current[posRow][posCol] == 1) {
            board.current[posRow][posCol] = 0;
            points.current = points.current + 10;
            howManyPelets.current--;
            console.log("left pelefts: " + howManyPelets.current)
            if (howManyPelets.current == 0) {
                endOfGame(GameState.WIN);
            }
        }

        if (board.current[posRow][posCol] == 2) {
            board.current[posRow][posCol] = 0;
            points.current = points.current + 20;
            isBigPelletEaten.current = true;
            makeSoundVixa();
        }
    }

    function endOfGame(status) {
        gameState.current = status;
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

            makeSoundMovePacManTimer.current = makeSoundMovePacManTimer.current + gameCycle;

            if(makeSoundMovePacManTimer.current > 440)
            {
                makeSoundMovePacMan();
                makeSoundMovePacManTimer.current =0;
            }
            return false;
        }

    }

    function checkCollisionWithPacMan(Ghost, PacManPos) {
        let GhostPos = Ghost.getPos();
        let GhostDir = Ghost.getDir();
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

        if (Ghost.isEatable() == false && Ghost.isAirState() == false) 
         {
            if (Ghost.getPos().posRow == PacManPos.posRow && Ghost.getPos().posCol == PacManPos.posCol) {

                if(lives.current > 1)
                {
                    lives.current--;
                    gameState.current = GameState.DEAD;
                    resetRound();
                }
                else
                {
                    endOfGame(GameState.LOSE);
                }

                return true;
            }
            return false
        }
        else 
        {
            if (Ghost.isAirState() == false) {
                if (Ghost.getPos().posRow == PacManPos.posRow && Ghost.getPos().posCol == PacManPos.posCol) {
                    pacManEatGhost(Ghost);
                }
            }
        }
    }

    function checkCollisionWithGhost(Ghost, PacManDir, PacManPos) {
        switch (PacManDir) {
            case 0:
                {
                    PacManPos.posCol++;
                }
                break;

            case 1:
                {
                    PacManPos.posRow++;
                }
                break;

            case 2:
                {
                    PacManPos.posCol--;
                }
                break;

            case 3:
                {
                    PacManPos.posRow--;
                }
                break;
        }

        if (Ghost.isEatable() == false && Ghost.isAirState() == false) 
        {
            if (Ghost.getPos().posRow == PacManPos.posRow && Ghost.getPos().posCol == PacManPos.posCol) {
                if(lives.current > 1)
                    {
                        lives.current--;
                        gameState.current = GameState.DEAD;
                        resetRound();
                    }
                    else
                    {
                        endOfGame(GameState.LOSE);
                    }
    
                    return true;
            }
            return false
        }
        else {
            if (Ghost.isAirState() == false) {
                if (Ghost.getPos().posRow == PacManPos.posRow && Ghost.getPos().posCol == PacManPos.posCol) {
                    pacManEatGhost(Ghost);
                }
            }
        }
    }

    function pacManEatGhost(Ghost) {

        points.current = points.current + 200 * Math.pow(2, combo.current);
        combo.current++;
        Ghost.setAirState(true); //come back base as skull
        Ghost.setEatable(false);
        Ghost.setTarget({ posRow: 14, posCol: 14 }, btsFinder.current);
        consumptionOfGhost();
    }

    function resetRound()
    {
        combo.current = 0;
        pacManCharacter.current = new Character(23, 14, Direction.RIGHT);
        redGhostCharacter.current = new Character(13, 13, Direction.UP);
        orangeGhostCharacter.current = new Character(15, 11, Direction.UP);
        pinkGhostCharacter.current = new Character(15, 14, Direction.UP);
        cyanGhostCharacter.current =new Character(15, 16, Direction.UP);

        pacManCharacter.current.setFreez(true);
        redGhostCharacter.current.setFreez(true);
        orangeGhostCharacter.current.setFreez(true);
        pinkGhostCharacter.current.setFreez(true);
        cyanGhostCharacter.current.setFreez(true);

        isBigPelletEaten.current = false;

        clearTimeout(timeoutEatable.current);
        clearTimeout(waitDead);
    }

    function resetGame()
    {
        isPopUpMenuShow.current = false;
        resetRound();
        combo.current = 0;
        points.current = 0;
        lives.current = 3;
        howManyPelets.current = board.current.reduce((total, element) => { return total = total + element.filter((square) => square == 1).length }, 0);
        board.current = boardCopy.current.map((element) => element.map(square => square));

        gameState.current = GameState.START;
        setState((prev) => prev + 1);
    }

    function moveAllCharacter() {
        pacManCharacter.current.move();

        redGhostCharacter.current.moveWithAutopilot(btsFinder.current, avaiablePlces.current); //if freeze it will not move
        orangeGhostCharacter.current.moveWithAutopilot(btsFinder.current, avaiablePlces.current); 
        pinkGhostCharacter.current.moveWithAutopilot(btsFinder.current, avaiablePlces.current); 
        cyanGhostCharacter.current.moveWithAutopilot(btsFinder.current, avaiablePlces.current); 

    }

    function oneCycleOfGame() {

        if (gameState.current == GameState.RUN) {
            
            isPointEaten(pacManCharacter.current.getPos());
            moveAllCharacter();

            if (bigEvent.current != null) {
                pacManCharacter.current.changeDir(bigEvent.current);
                bigEvent.current = null;
            }
            //pacman
            checkCollisionWithWall(pacManCharacter.current.getPos(), pacManCharacter.current.getDir());
            checkCollisionWithGhost(redGhostCharacter.current, pacManCharacter.current.getDir(), pacManCharacter.current.getPos())
            checkCollisionWithGhost(orangeGhostCharacter.current, pacManCharacter.current.getDir(), pacManCharacter.current.getPos())
            checkCollisionWithGhost(pinkGhostCharacter.current, pacManCharacter.current.getDir(), pacManCharacter.current.getPos())
            checkCollisionWithGhost(cyanGhostCharacter.current, pacManCharacter.current.getDir(), pacManCharacter.current.getPos())

            //orange

            checkCollisionWithPacMan(orangeGhostCharacter.current, pacManCharacter.current.getPos())

            //red
           
            checkCollisionWithPacMan(redGhostCharacter.current, pacManCharacter.current.getPos())
                
            //pink
           
            checkCollisionWithPacMan(pinkGhostCharacter.current, pacManCharacter.current.getPos())

            //cyan
           
            checkCollisionWithPacMan(cyanGhostCharacter.current, pacManCharacter.current.getPos())
            setState((prev) => prev + 1);
        }
    }

    function changeIsEatableAllGhost(val) {
        redGhostCharacter.current.setEatable(val);
        orangeGhostCharacter.current.setEatable(val);
        pinkGhostCharacter.current.setEatable(val);
        cyanGhostCharacter.current.setEatable(val);
    }

    useEffect( //set clock
        () => {

            if(gameState.current == GameState.DEAD || gameState.current == GameState.START)
            { 
                switch(lives.current)
                {
                    case 2:
                        makeSoundDead1()
                    break;
        
                    case 1:
                        makeSoundDead2()
                    break;
        
                    case 0:
                        makeSoundDead3()
                    break;
                }

                waitDead = setTimeout( () =>
                {
                    gameState.current = GameState.RUN;
                    clock.current = setTimeout(() => 
                        {
                        
                        pacManCharacter.current.setFreez(false)
                        redGhostCharacter.current.setFreez(false)
                        orangeGhostCharacter.current.setFreez(false)
                        pinkGhostCharacter.current.setFreez(false)
                        cyanGhostCharacter.current.setFreez(false)
                        
                        oneCycleOfGame()}, gameCycle);
                }, 2000);       
            }
            else
            {
                clock.current = setTimeout(() => oneCycleOfGame(), gameCycle);
            }
           

            if (isBigPelletEaten.current == true) {
                combo.current = 0;
                changeIsEatableAllGhost(true);
                isBigPelletEaten.current = false;

                timeoutEatable.current = setTimeout(() => {
                    objControlmakeVixa.stop();
                    changeIsEatableAllGhost(false);
                }, 7000);
            }

            return () => { //cleanup
                clearTimeout(clock.current);
                clearTimeout(waitDead);
                
            }
        }

        , [state]);

        function popUpContent(val)
        {
            if(val == 'win')
            {
                makeSoundWin();
            }
            else
            {
                makeSoundDead3();
            }
           

            return (
                <div className="endContent">
                    <div className="endPic">
                        <div style={{
                            width: `${300}px`,
                            height: `${300}px`,
                            backgroundImage: `url(${ val == 'win' ? winPic : losePic})`,
                            backgroundSize: `${300}px ${300}px`, // Scale the background image
                            backgroundRepeat: "no-repeat",
                        }}/>
                    </div>
                    <div className="endText">
                        You Got: {points.current}
                    </div>
                    <div className="endButton">
                        <Button text={'RESTART'} onClickFun={() => resetGame()}/>
                    </div>
                </div>
            )
        }

    function openMenu()
    {
        isPopUpMenuShow.current = true;
        setState((prev)=>prev+1);
        console.log("menu clicked");
    }

    function renderBoard() {
        return (

            <div>
            { 
                (isPopUpMenuShow.current == true ) 
                ?
                <div className="popUpMenu">
                    <div className="popUpMenuInner">
                    <div className="popUpMenuRestart" onClick={()=>{ resetGame()}}>
                        RESTART
                    </div>    

                    <div className="popUpMenuClose" onClick={() => {isPopUpMenuShow.current = false}}>
                        CLOSE
                    </div>    
                    </div>
                </div>    

                :
                <>
                </>
            }   
            <div className="backgroundcontainer" >
            {
            (gameState.current == GameState.RUN || gameState.current == GameState.DEAD || gameState.current == GameState.START)?      
                
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
                                element.map((x, col) => 
                                {
                                if (row == pacManCharacter.current.getPos().posRow && col == pacManCharacter.current.getPos().posCol)
                                    return (<PacMan isFreez={pacManCharacter.current.getIsFreez()} tileSize={30} gameCycle={gameCycle} xCentrum={tileSize.current / 2} yCentrum={tileSize.current / 2} rotate={pacManCharacter.current.getAngleOfRotate()} dir={pacManCharacter.current.getDir()} />)
                                else if (row == redGhostCharacter.current.getPos().posRow && col == redGhostCharacter.current.getPos().posCol)
                                    return (<Ghost isEatable={redGhostCharacter.current.isEatable()} isAirState={redGhostCharacter.current.isAirState()} ghostSprite={{ color: redGhost, pork: eatableGhost, skull: skull }} isFreez={redGhostCharacter.current.getIsFreez()} tileSize={30} gameCycle={gameCycle} xCentrum={tileSize.current / 2} yCentrum={tileSize.current / 2} rotate={redGhostCharacter.current.getAngleOfRotate()} dir={redGhostCharacter.current.getDir()} />)
                                
                                else if (row == orangeGhostCharacter.current.getPos().posRow && col == orangeGhostCharacter.current.getPos().posCol)
                                    return (<Ghost isEatable={orangeGhostCharacter.current.isEatable()} isAirState={orangeGhostCharacter.current.isAirState()} ghostSprite={{ color: orangeGhost, pork: eatableGhost, skull: skull }} isFreez={orangeGhostCharacter.current.getIsFreez()} tileSize={30} gameCycle={gameCycle} xCentrum={tileSize.current / 2} yCentrum={tileSize.current / 2} rotate={orangeGhostCharacter.current.getAngleOfRotate()} dir={orangeGhostCharacter.current.getDir()} />)

                                else if (row == pinkGhostCharacter.current.getPos().posRow && col == pinkGhostCharacter.current.getPos().posCol)
                                    return (<Ghost isEatable={pinkGhostCharacter.current.isEatable()} isAirState={pinkGhostCharacter.current.isAirState()} ghostSprite={{ color: pinkGhost, pork: eatableGhost, skull: skull }} isFreez={pinkGhostCharacter.current.getIsFreez()} tileSize={30} gameCycle={gameCycle} xCentrum={tileSize.current / 2} yCentrum={tileSize.current / 2} rotate={pinkGhostCharacter.current.getAngleOfRotate()} dir={pinkGhostCharacter.current.getDir()} />)

                                else if (row == cyanGhostCharacter.current.getPos().posRow && col == cyanGhostCharacter.current.getPos().posCol)
                                    return (<Ghost isEatable={cyanGhostCharacter.current.isEatable()} isAirState={cyanGhostCharacter.current.isAirState()} ghostSprite={{ color: cyanGhost, pork: eatableGhost, skull: skull }} isFreez={cyanGhostCharacter.current.getIsFreez()} tileSize={30} gameCycle={gameCycle} xCentrum={tileSize.current / 2} yCentrum={tileSize.current / 2} rotate={cyanGhostCharacter.current.getAngleOfRotate()} dir={cyanGhostCharacter.current.getDir()} />)

                                else
                                    return (<div className={"tile " + styleArray.current[`${board.current[row][col]}`]} key={`${row}-${col}`}>
                                    </div>)
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
                        <div onClick={() => openMenu()}>MENU</div>
                    </div>
                </div>

            </div>
            :
            <div className="popUpWindow">
                {
                    (gameState.current == GameState.WIN && gameState.current != GameState.DEAD)? 
                    popUpContent('win')
                    :
                    popUpContent('lose')
                }
            </div>
            }            
            </div>
              
            </div>
        )
    }

    return (
        <>
            {renderBoard()}
        </>
    );
}