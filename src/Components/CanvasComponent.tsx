import React from "react";
import { SketchPicker } from "react-color";

interface Point {
  x: number;
  y: number;
}

interface Color {
  hex: string;
}

class CanvasComponent extends React.Component {
  state = {
    background: "#121212",
    choice: "brush",
    canvas: {} as HTMLCanvasElement,
  };

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
  };

  componentDidMount() {
    this.updateCanvas();
  }
  updateCanvas() {
    let isDrawing: boolean, lastPoint: Point;
    const canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;
    
    // Setting up width and height of canvas
    const sizeMax = Math.max(window.innerWidth,window.innerHeight)
    canvas.width = sizeMax;
    canvas.height = sizeMax;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ctx:any = canvas.getContext("2d");
    let jobStart = false;
    let canvasPic;
    let pstate;
    let plvalx;
    let plvaly;

    this.setState({ canvas });

    ctx.beginPath();
    ctx.rect(0, 0, canvasHeight, canvasWidth);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    function distanceBetween(point1: Point, point2: Point) {
      return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
      );
    }

    function angleBetween(point1: Point, point2: Point) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    function getMouse(e, canvas) {
      let offsetX = 0,
        offsetY = 0,
        mx: number,
        my: number;

      if (canvas.offsetParent !== undefined) {
        do {
          offsetX += canvas.offsetLeft;
          offsetY += canvas.offsetTop;
        } while ((canvas = canvas.offsetParent));
      }

      if (e.touches) {
        mx = (e.clientX || e.touches[0].clientX) + offsetX;
        my = (e.clientY || e.touches[0].clientY) + offsetY;
      } else {
        mx = e.clientX + offsetX;
        my = e.clientY + offsetY;
      }

      return { x: mx, y: my };
    }

    let handleMouseOut = (e) => {
      isDrawing = false;
    };

    let handleMouseDown = (e) => {
      isDrawing = true;
      lastPoint = getMouse(e, canvas);
      jobStart = true;
    };

    let handleMouseMove = (e) => {
      if (!isDrawing) {
        return;
      }

      e.preventDefault();

      if (this.state.choice === "rectangle") {
        if (jobStart) {
          jobStart = false;
          pstate = canvas.toDataURL();
        }
        canvasPic = new Image();
        canvasPic.src = pstate;
        canvasPic.onload = () => {
          if (e.touches) {
            plvalx = e.clientX || e.touches[0].clientX;
            plvaly = e.clientY || e.touches[0].clientY;
          } else {
            plvalx = e.clientX;
            plvaly = e.clientY;
          }
          ctx.drawImage(canvasPic, 0, 0);
          ctx.fillStyle = this.state.background;
          ctx.beginPath();
          ctx.rect(
            lastPoint.x,
            lastPoint.y,
            plvalx - lastPoint.x,
            plvaly - lastPoint.y
          );
          ctx.fill();
          return;
        };
        return;
      }

      if (this.state.choice === "circle") {
        if (jobStart) {
          jobStart = false;
          pstate = canvas.toDataURL();
        }
        canvasPic = new Image();
        canvasPic.src = pstate;
        canvasPic.onload = () => {
          if (e.touches) {
            plvalx = e.clientX || e.touches[0].clientX;
            plvaly = e.clientY || e.touches[0].clientY;
          } else {
            plvalx = e.clientX;
            plvaly = e.clientY;
          }
          ctx.drawImage(canvasPic, 0, 0);
          ctx.fillStyle = this.state.background;
          ctx.beginPath();
          ctx.arc(
            lastPoint.x,
            lastPoint.y,
            Math.max(
              Math.abs(plvalx - lastPoint.x),
              Math.abs(plvaly - lastPoint.y)
            ),
            0,
            2 * Math.PI
          );
          ctx.fill();
          return;
        };
        return;
      }

      let currentPoint = getMouse(e, canvas),
        dist = distanceBetween(lastPoint, currentPoint),
        angle = angleBetween(lastPoint, currentPoint),
        x,
        y;

      for (let i = 0; i < dist; i++) {
        x = lastPoint.x + Math.sin(angle) * i - 0;
        y = lastPoint.y + Math.cos(angle) * i - 0;
        ctx.fillStyle = this.state.background;
        ctx.beginPath();
        ctx.rect(x, y, 5, 5);
        ctx.fill();
      }
      lastPoint = currentPoint;
    };

    let handleMouseUp = (e) => {
      isDrawing = false;
    };

    canvas.addEventListener("mouseout", handleMouseOut, false);
    canvas.addEventListener("mousedown", handleMouseDown, false);
    canvas.addEventListener("touchstart", handleMouseDown, false);
    canvas.addEventListener("mousemove", handleMouseMove, false);
    canvas.addEventListener("touchmove", handleMouseMove, false);
    canvas.addEventListener("mouseup", handleMouseUp, false);
    canvas.addEventListener("touchend", handleMouseUp, false);
  }
  render() {
    return (
      <React.Fragment>
        <canvas id="canvas" ref="canvas"/>
        <div className="toolset">
          <button
            onClick={() => {
              this.setState({ choice: "brush" });
            }}
          >
            Brush
          </button>

          <button
            onClick={() => {
              this.setState({ choice: "brush" });
              this.setState({ background: "#ffffff" });
            }}
          >
            Eraser
          </button>


          <button
            onClick={() => {
              this.setState({ choice: "rectangle" });
            }}
          >
            Rectangle
          </button>

          <button
            onClick={() => {
              this.setState({ choice: "circle" });
            }}
          >
            Circle
          </button>

          <button onClick={this.updateCanvas.bind(this)}>Clear</button>

          <button
            onClick={() => {
              const link = document.createElement("a");
              link.download = "image.png";
              link.href = this.state.canvas.toDataURL();
              link.click();
            }}
          >
            Download
          </button>
          <SketchPicker
            color={this.state.background}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default CanvasComponent;
