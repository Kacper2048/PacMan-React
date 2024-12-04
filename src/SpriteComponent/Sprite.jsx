import React, { useState, useEffect, useRef} from "react";
import "./spriteStyle.css"; // Include styles here

export default function Sprite({ sprite, yCentrum, xCentrum, frameWidth, frameHeight, frameCount, speed, ColPercOfProgress, RowPercOfProgress, howMuch=0 ,rotate=0, isRevert=false, offset=0})
{
  let [currentFrame, setCurrentFrame] = useState(offset);
  let direction = useRef('right');
  let interval = useRef(null)
  useEffect(() => 
  {
      if(speed > 0)
      {
        if(howMuch == 0)
        {
          if(direction.current == 'right')
            {
                interval = setTimeout(() => 
                {
                  setCurrentFrame((prev) => 
                  { 
                    if(prev + 2 == frameCount) //prev + 2 because the lest one frame will be rendered after this cycle and if there would be +1 then it go outside the range
                    {
                      direction.current = 'left';
                    }
                    return (prev+1);
                  });
                }, speed);
            }
            else
            {
                interval = setTimeout(() => 
                {
                  setCurrentFrame((prev) => 
                  { 
                    if(prev-1 == 0)
                    {
                      direction.current = 'right';
                    }
                    return (prev-1);
                  });
                }, speed);
            }
        }
        else if(howMuch > 0)
        {

            interval = setTimeout(() => 
            {
              setCurrentFrame((prev) => 
              { 
                if(prev+1 >= offset+howMuch) //prev + 2 because the lest one frame will be rendered after this cycle and if there would be +1 then it go outside the range
                {
                  return (offset);
                }
                return (prev+1);
              });
            }, speed);
        }
      }
      else
      {
        setCurrentFrame(frameCount-1);
      }

    return(
      ()=>clearTimeout(interval)
    );
  }, [currentFrame]);

  return (
    speed > 0 ?
    <div
      className="sprite"
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        backgroundImage: `url(${sprite})`,
        backgroundPosition: `-${(currentFrame) * frameWidth}px 0px`, // Move horizontally
        backgroundSize: `${frameWidth * frameCount}px ${frameHeight}px`, // Scale the background image
        backgroundRepeat: "no-repeat",
        position: 'absolute',
        left: `${xCentrum}px`,  // Align horizontally to the center of the parent
        top: `${yCentrum}px`,   // Align vertically to the center of the parent  // Adjust to center the div exactly
        transform: `translate(${ColPercOfProgress-25}px, ${RowPercOfProgress-25}px) rotate(${rotate}deg)`,
      }}
    >

    </div>
    :
    <div
      className="sprite"
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        backgroundImage: `url(${sprite})`,
        backgroundPosition: `-${xCentrum * frameWidth}px 0px`, // Move horizontally
        backgroundSize: `${frameWidth * frameCount}px ${frameHeight}px`, // Scale the background image
        backgroundRepeat: "no-repeat",
        transform: `rotate(${rotate}deg)`,
      }}
    >

    </div>
  );
};