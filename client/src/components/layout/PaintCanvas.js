import React, { useRef, useState, useEffect } from "react";

import styles from "../pages/Searchusers.module.css";

import Button from "@material-ui/core/Button";
import BlackPenImage from "../assets/blackpen.svg";
import BluePenImage from "../assets/bluepen.svg";
import GreenPenImage from "../assets/greenpen.svg";
import RedPenImage from "../assets/redpen.svg";
import ClearImage from "../assets/clear.svg";
import EraserImage from "../assets/eraser.svg";

function PaintCanvas(props) {
  let ctx;

  // colors:
  // black: #000000
  // blue: #0277BD
  // red: #F44336
  // green: #00695C
  // white/eraser: #FFFFFF

  const canvasRef = useRef("");

  const [isDrawing, changeIsDrawing] = useState(false);

  const [strokeVariablesState, changeStrokeVariablesState] = useState({
    color: "#000000",
    width: 3
  });

  const [canvasClassState, changeCanvasClassState] = useState(
    styles.canvasClass
  );

  let isDragging = false;

  const mouseDownFunction = e => {
    changeIsDrawing(true);

    if (ctx) {
      wrapperForDraw(e);
    }
  };

  const mouseUpFunction = e => {
    if (ctx) {
      ctx.beginPath();
    }

    changeIsDrawing(false);
    // draw(e);
  };

  const mouseMoveFunction = e => {
    if (ctx) {
      isDragging = true;

      wrapperForDraw(e, isDragging);
    }
  };

  let xCoord = [];
  let yCoord = [];
  let dragArray = [];

  const wrapperForDraw = (e, isDragging = false) => {
    if (!isDrawing) return;

    // xCoord.push(e.clientX);
    // yCoord.push(e.clientY);

    xCoord.push(e.clientX - canvasRef.current.getBoundingClientRect().x);
    yCoord.push(e.clientY - canvasRef.current.getBoundingClientRect().y);

    dragArray.push(isDragging);

    drawFunction(xCoord, yCoord, dragArray);

    props.socket.emit("drawing", {
      to: props.connectedTo,
      xCoord,
      yCoord,
      dragArray,
      strokeColor: strokeVariablesState.color,
      strokeThick: strokeVariablesState.width
    });

    xCoord.splice(0, xCoord.length * 0.9);
    yCoord.splice(0, yCoord.length * 0.9);
    dragArray.splice(0, dragArray.length * 0.9);
  };

  const clearCanvas = () => {
    if (ctx) {
      // let { top, left } = canvasRef.current.getBoundingClientRect();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // changeCanvasClearState(true);

      props.socket.emit("clearBoard", {
        to: props.connectedTo
      });

      xCoord.splice(0, xCoord.length);
      yCoord.splice(0, yCoord.length);
      dragArray.splice(0, dragArray.length);
    }
  };

  const clearCanvasFromSocket = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      xCoord.splice(0, xCoord.length);
      yCoord.splice(0, yCoord.length);
      dragArray.splice(0, dragArray.length);
    }
  };

  const changeColor = newColor => {
    // console.log("inside change color function");
    if (newColor == "blue") {
      changeStrokeVariablesState({
        color: "#0277BD",
        width: 3
      });
      changeCanvasClassState(styles.canvasClassBlue);
    }
    if (newColor == "white") {
      changeStrokeVariablesState({
        color: "#FFFFFF",
        width: 25
      });
      changeCanvasClassState(styles.canvasClassEraser);
    }
    if (newColor == "black") {
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
  };

  const drawFunction = (xCoord, yCoord, dragArray) => {
    if (!isDrawing) return;

    ctx.lineCap = "round";
    ctx.strokeStyle = strokeVariablesState.color;
    ctx.lineWidth = strokeVariablesState.width;

    for (let i = 0; i < xCoord.length; i++) {
      ctx.beginPath();
      if (dragArray[i] && i) {
        // ctx.moveTo(xCoord[i - 1] - left, yCoord[i - 1] - top + 32);
        // ctx.moveTo(
        //   xCoord[i - 1] + canvasRef.current.getBoundingClientRect().x,
        //   yCoord[i - 1] + canvasRef.current.getBoundingClientRect().y + 32
        // );

        ctx.moveTo(xCoord[i - 1], yCoord[i - 1] + 32);
      } else {
        // ctx.moveTo(xCoord[i] - 1 - left, yCoord[i] - top + 32);
        // ctx.moveTo(
        //   xCoord[i] - 1 + canvasRef.current.getBoundingClientRect().x,
        //   yCoord[i] + canvasRef.current.getBoundingClientRect().y + 32
        // );

        ctx.moveTo(xCoord[i] - 1, yCoord[i] + 32);
      }
      // ctx.lineTo(xCoord[i] - left, yCoord[i] - top + 32);

      // ctx.lineTo(
      //   xCoord[i] - 1 + canvasRef.current.getBoundingClientRect().x,
      //   yCoord[i] + canvasRef.current.getBoundingClientRect().y + 32
      // );

      ctx.lineTo(xCoord[i] - 1, yCoord[i] + 32);

      ctx.closePath();
      ctx.stroke();
    }
  };

  // console.log("xCoord");
  // console.log(xCoord);

  const drawFunctionFromSocket = (
    xCoord,
    yCoord,
    dragArray,
    strokeColor = "#000000",
    strokeThick = "3"
  ) => {
    if (ctx && canvasRef.current) {
      ctx.lineCap = "round";
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeThick;

      for (let i = 0; i < xCoord.length; i++) {
        ctx.beginPath();
        if (dragArray[i] && i) {
          // ctx.moveTo(xCoord[i - 1] - left, yCoord[i - 1] - top + 32);

          // ctx.moveTo(
          //   xCoord[i - 1] + canvasRef.current.getBoundingClientRect().x,
          //   yCoord[i - 1] + canvasRef.current.getBoundingClientRect().y + 32
          // );

          ctx.moveTo(xCoord[i - 1], yCoord[i - 1] + 32);
        } else {
          // ctx.moveTo(xCoord[i] - 1 - left, yCoord[i] - top + 32);
          // ctx.moveTo(
          //   xCoord[i] - 1 + canvasRef.current.getBoundingClientRect().x,
          //   yCoord[i] + canvasRef.current.getBoundingClientRect().y + 32
          // );

          ctx.moveTo(xCoord[i] - 1, yCoord[i] + 32);
        }
        // ctx.lineTo(xCoord[i] - left, yCoord[i] - top + 32);
        // ctx.lineTo(
        //   xCoord[i] - 1 + canvasRef.current.getBoundingClientRect().x,
        //   yCoord[i] + canvasRef.current.getBoundingClientRect().y + 32
        // );

        ctx.lineTo(xCoord[i] - 1, yCoord[i] + 32);

        ctx.closePath();
        ctx.stroke();
      }
    }
  };

  props.socket.on("clearBoardFromServer", () => {
    clearCanvasFromSocket();
  });

  props.socket.on("receiveDrawing", data => {
    // console.log("inside recieve socket drawing data");
    if (ctx) {
      drawFunctionFromSocket(
        data.xCoord,
        data.yCoord,
        data.dragArray,
        data.strokeColor,
        data.strokeThick
      );
    }
  });

  useEffect(() => {
    let canvas = canvasRef.current;

    ctx = canvas.getContext("2d");

    xCoord.splice(0, xCoord.length);
    yCoord.splice(0, yCoord.length);
    dragArray.splice(0, dragArray.length);
  });

  return (
    <div className={styles.insidePaintComponent}>
      <div className={styles.paintButtons}>
        <Button onClick={clearCanvas}>
          <img src={ClearImage} alt="clear" />
        </Button>
        <Button
          onClick={() => {
            changeColor("black");
          }}
        >
          <img src={BlackPenImage} alt="blackpen" />
        </Button>
        <Button
          onClick={() => {
            changeColor("blue");
          }}
        >
          <img src={BluePenImage} alt="bluepen" />
        </Button>
        <Button
          onClick={() => {
            changeColor("red");
          }}
        >
          <img src={RedPenImage} alt="redpen" />
        </Button>
        <Button
          onClick={() => {
            changeColor("green");
          }}
        >
          <img src={GreenPenImage} alt="greenpen" />
        </Button>
        <Button
          onClick={() => {
            changeColor("white");
          }}
        >
          <img src={EraserImage} alt="eraser" />
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        // width="100%"
        width="500px"
        height="500px"
        // height="100%"
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
