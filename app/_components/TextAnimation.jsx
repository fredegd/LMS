"use client";
import React, { useEffect } from "react";
import EnterButton from "./EnterButton";

export default function TextAnimation() {
  useEffect(() => {
    const textContainer = document.getElementById("textContainer");
    const res = 10;
    const step = 1;
    // const str1 ="Hello World !  ";
    const str1 =
      "A        Unique        Selection        of        Useful        CODE        SNIPPETS          &        RESOURCES               ";

    let count = 0;
    let toBeCleared = false;

    const iter = setInterval(() => {
      textContainer.innerHTML = "";
      for (let j = 0; j <= res * 1; j += step) {
        const row = document.createElement("div");
        row.classList.add("flex");
        for (let i = 0; i <= res * 6; i += step) {
          const charIndex =
            Math.floor(
              i +
                count +
                j *
                  Math.abs(
                    Math.tan(radians(j * 0.025 + ((0.5 * count) % 360))) *
                      Math.cos(  radians( j - res * 2 + //* Math.cos(radians(count + 90)) * 0.4 +
                      +i-res/2+      
                      (count*0.5 % 360)
                        )
                      )
                  )
            ) %
            (str1.length - 1);
          // const charIndex = i+j +count
          const character = document.createElement("h1");
          character.textContent =
            str1.charAt(charIndex) == " " ? "_" : str1.charAt(charIndex);
          character.classList.add("character");
          character.classList.add("text-[2.5vw]");

          row.appendChild(character);
        }
        textContainer.appendChild(row);
      }

      count += 1;
      const rows = textContainer.querySelectorAll(".row");
      // rows.forEach((row, rowIndex) => {
      //   const characters = row.querySelectorAll(".character");
      //   characters.forEach((character, columnIndex) => {
      //     const x = columnIndex * step;
      //     const y = rowIndex * step;
      //     const d = Math.sqrt(Math.pow(x - res, 2) + Math.pow(y - res, 2));
      //     const maxDist = Math.max(Math.sqrt(Math.pow(res, 2) * 2), 1);

      //     const gray = remap(
      //       d,
      //       1,
      //       maxDist *
      //         (Math.cos(x * 0.25 + Math.cos(y) * 0.1) +
      //           Math.cos(y * 0.1 - count * 0.05 - Math.abs(y * 0.2))),
      //       0,
      //       255
      //     );

      //     //  character.style.color = `rgb(${gray},${gray / 3},${gray / 10})`;
      //   });
      // });
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
