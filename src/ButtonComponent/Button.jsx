import React from 'react';
import './buttonStyle.css';

export default function Button({children, text, onClickFun})
{
    return(
        <div className='buttonContainer'>
            <div className='UnderButtonStyle'>
            </div>

            <div className='UpperButtonStyle' onClick={()=>{onClickFun()}}>
                {text}
            </div>
        </div>
    )
}