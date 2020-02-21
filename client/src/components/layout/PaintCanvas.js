import React, { useRef, useState, useEffect } from "react";
import { findDOMNode } from "react-dom";
import styles from "../pages/Searchusers.module.css";
import { Drawer } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import BlackPenImage from "../assets/blackpen.svg";
import BluePenImage from "../assets/bluepen.svg";
import GreenPenImage from "../assets/greenpen.svg";
import RedPenImage from "../assets/redpen.svg";
import ClearImage from "../assets/clear.svg";
import EraserImage from "../assets/eraser.svg";

function PaintCanvas(props) {
  //   let canvas;
  let ctx;
  let top;
  let left;

  // colors:
  // black: #000000
  // blue: #0277BD
  // red: #F44336
  // green: #00695C
  // white/eraser: #FFFFFF

  const canvasRef = useRef("");

  const [currPos, changeCurPos] = useState({
    x: null,
    y: null
  });

  const [isDrawing, changeIsDrawing] = useState(false);

  // const [strokes, changeStrokes] = useState([]);

  const [strokeVariablesState, changeStrokeVariablesState] = useState({
    color: "#000000",
    width: 3
  });

  const [canvasClassState, changeCanvasClassState] = useState(
    styles.canvasClass
  );

  let strokes = [];

  let xCoord = [];
  let yCoord = [];
  let isDragging = false;
  let dragArray = [];
  // var color = "#000000";
  // var strokeWidth = 3;

  // console.log("is Drawing: " + isDrawing);

  const mouseDownFunction = e => {
    // console.log("ctx in mouse down function");
    // console.log(ctx);
    // console.log("inside mouse down function");
    changeIsDrawing(true);

    if (ctx) {
      // drawFunction(e);
      wrapperForDraw(e);
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
      isDragging = true;
      // drawFunction(e);
      wrapperForDraw(e, isDragging);
    }

    // getCursorPosition(e);
  };

  const wrapperForDraw = (e, isDragging = false) => {
    if (!isDrawing) return;

    xCoord.push(e.clientX);
    yCoord.push(e.clientY);
    dragArray.push(isDragging);

    // strokes.push({
    //   x: e.clientX,
    //   y: e.clientY
    // });
    // console.log(JSON.stringify(strokes));
    drawFunction(xCoord, yCoord, dragArray);
  };

  const clearCanvas = () => {
    if (ctx) {
      // let { top, left } = canvasRef.current.getBoundingClientRect();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  const changeColor = newColor => {
    console.log("inside change color function");
    if (newColor == "blue") {
      changeStrokeVariablesState({
        color: "#0277BD",
        width: 3
      });
      changeCanvasClassState(styles.canvasClassBlue);
      // color = "#0000FF";
      // strokeWidth = 3;
      // ctx.strokeStyle = "#0000FF";
      // ctx.lineWidth = 3;
      // color = "#0000FF";
    }
    if (newColor == "white") {
      // ctx.strokeStyle = "#FFFFFF";
      // ctx.lineWidth = 25;
      // color = "#FFFFFF";
      // strokeWidth = 25;
      changeStrokeVariablesState({
        color: "#FFFFFF",
        width: 25
      });
      changeCanvasClassState(styles.canvasClassEraser);
    }
    if (newColor == "black") {
      // ctx.strokeStyle = "#000000";
      // ctx.lineWidth = 3;
      // color = "#000000";
      // strokeWidth = 3;
      changeStrokeVariablesState({
        color: "#000000",
        width: 3
      });
      changeCanvasClassState(styles.canvasClass);
    }
    if (newColor == "green") {
      changeStrokeVariablesState({
        color: "#00695C",
        width: 3
      });
      changeCanvasClassState(styles.canvasClassGreen);
    }
    if (newColor == "red") {
      changeStrokeVariablesState({
        color: "#F44336",
        width: 3
      });
      changeCanvasClassState(styles.canvasClassRed);
    }
    // color = newColor;
  };

  const drawFunction = (xCoord, yCoord, dragArray) => {
    // console.log("inside draw function");
    // console.log(color);
    let { top, left } = canvasRef.current.getBoundingClientRect();

    if (!isDrawing) return;

    // console.log("inside draw function");
    // console.log(ctx.strokeStyle);
    // console.log("color in draw function");

    ctx.lineCap = "round";
    ctx.strokeStyle = strokeVariablesState.color;
    ctx.lineWidth = strokeVariablesState.width;
    // if (ctx.strokeStyle == "#000000") {
    //   ctx.lineWidth = 3;
    // }

    // ctx.lineTo(e.clientX - left, e.clientY - top + 32);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(e.clientX - left, e.clientY - top + 32);

    // for (let i = 0; i < strokes.length; i++) {
    //   ctx.beginPath();
    //   ctx.moveTo(strokes[i].x - left, strokes[i].y - top + 32);
    //   ctx.lineTo(strokes[i].x - left, strokes[i].y - top + 32);
    //   ctx.closePath();
    //   ctx.stroke();
    // }

    for (let i = 0; i < xCoord.length; i++) {
      ctx.beginPath();
      if (dragArray[i] && i) {
        ctx.moveTo(xCoord[i - 1] - left, yCoord[i - 1] - top + 32);
      } else {
        ctx.moveTo(xCoord[i] - 1 - left, yCoord[i] - top + 32);
      }
      ctx.lineTo(xCoord[i] - left, yCoord[i] - top + 32);
      ctx.closePath();
      ctx.stroke();
    }
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
      <Button onClick={clearCanvas}>
        <img src={ClearImage} />
      </Button>
      <Button
        onClick={() => {
          changeColor("black");
        }}
      >
        <img src={BlackPenImage} />
      </Button>
      <Button
        onClick={() => {
          changeColor("blue");
        }}
      >
        <img src={BluePenImage} />
      </Button>
      <Button
        onClick={() => {
          changeColor("red");
        }}
      >
        <img src={RedPenImage} />
      </Button>
      <Button
        onClick={() => {
          changeColor("green");
        }}
      >
        <img src={GreenPenImage} />
      </Button>
      <Button
        onClick={() => {
          changeColor("white");
        }}
      >
        <img src={EraserImage} />
      </Button>
      <canvas
        ref={canvasRef}
        width="500px"
        height="500px"
        onMouseDown={mouseDownFunction}
        onMouseUp={mouseUpFunction}
        onMouseMove={mouseMoveFunction}
        className={canvasClassState}
      />
      <br />
    </div>
  );
}

export default PaintCanvas;
