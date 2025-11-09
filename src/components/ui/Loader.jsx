import React from "react";
import "./Loader.css"
const Loader = () => {
  return (
    <div className="h-[50vh] w-full flex flex-col  justify-center items-center">
      <div class="newtons-cradle">
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
      </div>
      <span>Loading</span>
    </div>
  );
};

export default Loader;
