import React, { useRef, useState, useEffect } from "react";
import { findDOMNode } from "react-dom";
import styles from "../pages/Searchusers.module.css";
import { Drawer } from "@material-ui/core";

function PaintCanvas(props) {
  //   let canvas;
  let ctx;
  let top;
  let left;

  const canvasRef = useRef("");

  const [currPos, changeCurPos] = useState({
    x: null,
    y: null
  });

  const [isDrawing, changeIsDrawing] = useState(false);

  const [strokes, changeStrokes] = useState([]);

  // console.log("is Drawing: " + isDrawing);

  const mouseDownFunction = e => {
    // console.log("ctx in mouse down function");
    // console.log(ctx);
    // console.log("inside mouse down function");
    changeIsDrawing(true);
    if (ctx) {
      drawFunction(e);
    }
  };

  const mouseUpFunction = e => {
    // console.log("inside mouse up function");
    // console.log("ctx in mouse up function");
    // console.log(ctx);

    if (ctx) {
      ctx.beginPath();
    }

    changeIsDrawing(false);
    // draw(e);
  };

  const mouseMoveFunction = e => {
    // console.log("inside mouse move function");

    // console.log("ctx in mouse move function");
    // console.log(ctx);

    // console.log(ctx);
    if (ctx) {
      drawFunction(e);
    }

    // getCursorPosition(e);
  };

  const drawFunction = e => {
    let { top, left } = canvasRef.current.getBoundingClientRect();

    if (!isDrawing) return;

    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX - left, e.clientY - top + 32);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - left, e.clientY - top + 32);
  };

  //   function getCursorPosition(e) {
  //     const { top, left } = canvasRef.current.getBoundingClientRect();
  //     changeCurPos({
  //       ...currPos,
  //       x: e.clientX - left,
  //       y: e.clientY - top
  //     });
  //     // console.log(currPos);
  //     return [e.clientX - left, e.clientY - top];
  //   }

  //draw function

  //   console.log("from paint canvas component");

  useEffect(() => {
    let canvas = canvasRef.current;
    // console.log(canvas.getBoundingClientRect());
    ctx = canvas.getContext("2d");

    // ctx.fillRect(50, 50, 100, 100);
  });

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="500px"
        height="500px"
        onMouseDown={mouseDownFunction}
        onMouseUp={mouseUpFunction}
        onMouseMove={mouseMoveFunction}
        className={styles.canvasClass}
      />
    </div>
  );
}

export default PaintCanvas;
