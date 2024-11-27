import React, { useState, useEffect, useRef} from "react";
import "./spriteStyle.css"; // Include styles here

export default function Sprite({ sprite, frameWidth, frameHeight, frameCount, speed, isRevert=false })
{
  let [currentFrame, setCurrentFrame] = useState(0);
  let direction = useRef('right');

  useEffect(() => 
  {
      let interval = null;
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

    return(
      ()=>clearTimeout(interval)
    );
  }, [currentFrame]);

  return (
    <div
      className="sprite"
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        backgroundImage: `url(${sprite})`,
        backgroundPosition: `-${currentFrame * frameWidth}px 0px`, // Move horizontally
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
};