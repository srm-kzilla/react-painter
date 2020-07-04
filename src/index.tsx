import React from "react";
import ReactDOM from "react-dom";
import { SketchPicker } from "react-color";
import "./styles.css";

class CanvasComponent extends React.Component {
  state = {
    background: "#121212",
    choice: "brush",
    canvas: {} as HTMLCanvasElement,
  };

  handleChangeComplete = (color: any) => {
    this.setState({ background: color.hex });
  };

  componentDidMount() {
    this.updateCanvas();
  }
  updateCanvas() {
    var isDrawing: any, lastPoint: any;
    var canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;
    var canvasWidth: any = canvas.width;
    var canvasHeight: any = canvas.height;
    var ctx: any = canvas.getContext("2d");

    var prevjob: any = {};
    var canvasPic: any;

    this.setState({ canvas: canvas });

    ctx.beginPath();
    ctx.rect(0, 0, canvasHeight, canvasWidth);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    canvas.addEventListener("mouseout", handleMouseOut.bind(this), false);
    canvas.addEventListener("mousedown", handleMouseDown.bind(this), false);
    canvas.addEventListener("touchstart", handleMouseDown.bind(this), false);
    canvas.addEventListener("mousemove", handleMouseMove.bind(this), false);
    canvas.addEventListener("touchmove", handleMouseMove.bind(this), false);
    canvas.addEventListener("mouseup", handleMouseUp.bind(this), false);
    canvas.addEventListener("touchend", handleMouseUp.bind(this), false);

    function distanceBetween(point1: any, point2: any) {
      return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
      );
    }

    function angleBetween(point1: any, point2: any) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    function handleMouseOut(e: any) {
      isDrawing = false;
    }

    function getMouse(e: any, canvas: any) {
      var offsetX: any = 0,
        offsetY: any = 0,
        mx: any,
        my: any;

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

    function handleMouseDown(e: any) {
      isDrawing = true;
      lastPoint = getMouse(e, canvas);
      prevjob = { done: false, x: 0, y: 0 };
    }

    var pstate: any;
    var plvalx: any;
    var plvaly: any;

    function handleMouseMove(e: any) {
      if (!isDrawing) {
        return;
      }

      e.preventDefault();

      if (this.state.choice === "rectangle") {
        if (prevjob.done === false) {
          prevjob.done = true;
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
        if (prevjob.done === false) {
          prevjob.done = true;
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

      var currentPoint: any = getMouse(e, canvas),
        dist: any = distanceBetween(lastPoint, currentPoint),
        angle: any = angleBetween(lastPoint, currentPoint),
        x: any,
        y: any;

      for (var i: any = 0; i < dist; i++) {
        x = lastPoint.x + Math.sin(angle) * i - 0;
        y = lastPoint.y + Math.cos(angle) * i - 0;
        ctx.fillStyle = this.state.background;
        ctx.beginPath();
        ctx.rect(x, y, 5, 5);
        ctx.fill();
      }
      lastPoint = currentPoint;
    }

    function handleMouseUp(e: any) {
      isDrawing = false;
    }
  }
  render() {
    return (
      <div className="main">
        <canvas id="canvas" ref="canvas" width={500} height={500} />
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
              var link: any = document.createElement("a");
              link.download = "image.png";
              link.href = this.state.canvas.toDataURL();
              link.click();
            }}
          >
            Downlaod
          </button>
          <SketchPicker
            color={this.state.background}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
      </div>
    );
  }
}
ReactDOM.render(<CanvasComponent />, document.getElementById("root"));