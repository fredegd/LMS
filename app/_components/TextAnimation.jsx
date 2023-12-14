"use client";
import React, { useEffect } from "react";

export default function TextAnimation() {
  const str1 =
  "A        Unique        Selection        of        Useful        CODE        SNIPPETS          &        RESOURCES               ";

  useEffect(() => {
    const textContainer = document.getElementById("textContainer");
    const res = 10;
    const step = 1;
    // const str1 ="Hello World !  ";
   
    let count = 0;
    let toBeCleared = false;

    const iter = setInterval(() => {
      textContainer.innerHTML = "";
      for (let j = 0; j <= res * 1; j += step) {
        const row = document.createElement("div");
        row.classList.add("flex");
        for (let i = 0; i <= res * 6; i += step) {
          // const charIndex =
          //   Math.floor(
          //     i +
          //       count +
          //       j *
          //         Math.abs(
          //           Math.tan(radians(j * 0.025 + ((0.5 * count) % 360))) *
          //             Math.cos(  radians( j - res * 2 + //* Math.cos(radians(count + 90)) * 0.4 +
          //             +i-res/2+      
          //             (count*0.5 % 360)
          //               )
          //             )
          //         )
          //   ) %
          //   (str1.length - 1);
          const charIndex = (i+j +count)%(str1.length-1);
          const character = document.createElement("span");
          character.textContent =
            str1.charAt(charIndex) == " " ? "_" : str1.charAt(charIndex);
          character.classList.add("character");
          // character.classList.add(`text-[${1.5}vw]`);
          character.style.fontSize = `${remap( charIndex%5, 0, str1.length,  2.5,2.25)}vw`;  
          character.style.color = `rgb(${remap(charIndex, 0, str1.length,  255,0)},${remap(charIndex, 0, str1.length,  115,0)},22)`;

          row.appendChild(character);
        }
        textContainer.appendChild(row);
      }

      count += 1;
     
      toBeCleared = true;
    }, 100);

    return () => {
      if (toBeCleared) {
        clearInterval(iter);
      }
    };
  }, []);

  function remap(value, fromLow, fromHigh, toLow, toHigh) {
    return (
      ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow
    );
  }

  function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  return (
    <div
      id="textContainer"
      className="w-full flex flex-col items-center "
    ></div>
  );
}
