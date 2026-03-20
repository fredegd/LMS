"use client";
import React, { useEffect } from "react";

export default function TextAnimation() {
  const str1 =
    "A        Unique        Selection        of        Useful        CODE        SNIPPETS          &        RESOURCES               ";

  useEffect(() => {
    const textContainer = document.getElementById("textContainer");
    if (!textContainer) return;

    const res = 10;
    const step = 1;

    let count = 0;
    let toBeCleared = false;

    const iter = setInterval(() => {
      textContainer.innerHTML = "";
      for (let j = 0; j <= res * 1; j += step) {
        const row = document.createElement("div");
        row.classList.add("flex");
        for (let i = 0; i <= res * 6; i += step) {
          const charIndex = (i + j + count) % (str1.length - 1);
          const character = document.createElement("span");
          character.textContent =
            str1.charAt(charIndex) === " " ? "_" : str1.charAt(charIndex);
          character.classList.add("character");
          character.style.fontSize = `${remap(charIndex % 5, 0, str1.length, 2.5, 2.25)}vw`;
          character.style.color = `rgb(${remap(charIndex, 0, str1.length, 255, 0)},${remap(charIndex, 0, str1.length, 115, 0)},22)`;

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

  function remap(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
    return (
      ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow
    );
  }

  // function radians(degrees: number): number {
  //   const pi = Math.PI;
  //   return degrees * (pi / 180);
  // }

  return (
    <div
      id="textContainer"
      className="w-full flex flex-col items-center "
    ></div>
  );
}
