import React from 'react';
import { useState, useRef, useEffect } from 'react';

import './boardStyle.css';


export default function BoardGenerator({children})
{
    let [state, setState] = useState(0);
    let board = useRef([[-7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5, -7, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -5],
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
        ]);
    let spacePainter = useRef([-7,-6,-5,-4,-3,-2,-1,0,1,2,3]) // -1=wall, 0=emptyspace, small pellet, big pellet, ghost wall
    let brush = useRef(0)
    let styleArray = useRef({ '-1': 'wall', '0':'emptySpace', '1':'smallPellet', '2':'bigPellet', '3':'ghostWall', '-7': 'downrightcorner', '-6': 'horizontal', '-5': 'leftdowncorner', '-4': 'vertical', '-3': 'topleftcorner', '-2': 'righttopcorner'
    }); //board style is based on value in board


    function changeBrush(val)
    {
        brush.current = val;
        setState((prev)=>prev+1);
    }

    function paintTile(row,col,val)
    {
        board.current[row][col] = val;
        setState((prev)=>prev+1);
    }
    
    function returnArray()
    {
        let final='';
        for(let x =0; x< board.current.length; x++)
        {
            let str ='';
            for(let y =0; y< board.current[x].length; y++)
            {
                str = str + board.current[x][y] + ', ';
            }
            str = str.slice(0, str.length-2);

            if(x+1 ==  board.current.length)
            {
                final = final + '[' + str + ']\n';
            }
            else
            {
                final =  final + '[' + str + '],\n'
            }
        
        }
        console.log('[' + final + ']');
    }
    function renderBoard()
    {
        return( 
            <div className='gridPainter'>
                <div className='board'>
                    {board.current.map( (element,row) => (
                        <div key={row} className='row'>
                        {
                            element.map( (x,col) => 
                            {
                                return(
                                <div  className={'tile ' + styleArray.current[`${board.current[row][col]}`]} key={`${row}-${col}`}  tabIndex={0} onClick={()=>paintTile(row,col,brush.current)}>
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

                <div className='colorYourLife'>
                    <div className='tile wall' onClick={()=>changeBrush(spacePainter.current[6])}>
                    </div>

                    <div className='tile emptySpace' onClick={()=>changeBrush(spacePainter.current[7])}>
                    </div>

                    <div className='tile smallPellet' onClick={()=>changeBrush(spacePainter.current[8])} >
                    </div>

                    <div className='tile bigPellet' onClick={()=>changeBrush(spacePainter.current[9])}>
                    </div>

                    <div className='tile ghostWall' onClick={()=>changeBrush(spacePainter.current[10])}>
                    </div>

                    <div className='tile downrightcorner' onClick={()=>changeBrush(spacePainter.current[0])}>
                    </div>

                    <div className='tile horizontal' onClick={()=>changeBrush(spacePainter.current[1])}>
                    </div>

                    <div className='tile leftdowncorner' onClick={()=>changeBrush(spacePainter.current[2])} >
                    </div>

                    <div className='tile vertical' onClick={()=>changeBrush(spacePainter.current[3])}>
                    </div>

                    <div className='tile topleftcorner' onClick={()=>changeBrush(spacePainter.current[4])}>
                    </div>

                    <div className='tile righttopcorner' onClick={()=>changeBrush(spacePainter.current[5])}>
                    </div>

                    <button onClick={() => returnArray()}>
                        Return Array
                    </button>
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