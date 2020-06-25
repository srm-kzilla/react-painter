import React from "react";
import ReactDOM from "react-dom";
import { SketchPicker } from 'react-color';
import "./styles.css";

class CanvasComponent extends React.Component {
    _choiceHandler = 'brush';
    _color = 'white'


    state = {
        background: '#121212',
    };

    handleChangeComplete = (color) => {
        this.setState({ background: color.hex });
    };





    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
        if (this._choiceHandler!=='brush')
          return ;
        var isDrawing, lastPoint;
        var canvas       = this.refs.canvas,
            canvasWidth  = canvas.width,
            canvasHeight = canvas.height,
            ctx          = canvas.getContext('2d'),
            brush        = new Image();
        
        ctx.beginPath();
        ctx.rect(0, 0, canvasHeight, canvasWidth);
        ctx.fillStyle = "#fff";
        ctx.fill();
        // brush = new Image();             
        // brush.src = "../public/htmlTest/brush.png"; // here i load the image
        canvas.addEventListener('mousedown', handleMouseDown, false);
        canvas.addEventListener('touchstart', handleMouseDown, false);
        canvas.addEventListener('mousemove', handleMouseMove.bind(this), false);
        canvas.addEventListener('touchmove', handleMouseMove.bind(this), false);
        canvas.addEventListener('mouseup', handleMouseUp, false);
        canvas.addEventListener('touchend', handleMouseUp, false);

        function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }

        function angleBetween(point1, point2) {
        return Math.atan2( point2.x - point1.x, point2.y - point1.y );
        }

        function getFilledInPixels(stride) {
        if (!stride || stride < 1) { stride = 1; }
        
        var pixels   = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
            pdata    = pixels.data,
            l        = pdata.length,
            total    = (l / stride),
            count    = 0;
        
        // Iterate over all pixels
        for(var i = count = 0; i < l; i += stride) {
            if (parseInt(pdata[i]) === 0) {
            count++;
            }
        }
        
        return Math.round((count / total) * 100);
        }

        function getMouse(e, canvas) {
        var offsetX = 0, offsetY = 0, mx, my;

        if (canvas.offsetParent !== undefined) {
            do {
            offsetX += canvas.offsetLeft;
            offsetY += canvas.offsetTop;
            } while ((canvas = canvas.offsetParent));
        }

        mx = (e.clientX) + offsetX;
        my = (e.clientY) + offsetY;

        return {x: mx, y: my};
        }

        function handlePercentage(filledInPixels) {
            filledInPixels = filledInPixels || 0;
            if (filledInPixels > 40) {
                // canvas.parentNode.removeChild(canvas);
                // $('#scratch-card-title').html(`Click the image to go to the Portal`);
            }
        }

        function handleMouseDown(e) {
        isDrawing = true;
        lastPoint = getMouse(e, canvas);
        }

        function handleMouseMove(e) {
          if (!isDrawing) { return; }
          
          e.preventDefault();

          var currentPoint = getMouse(e, canvas),
              dist = distanceBetween(lastPoint, currentPoint),
              angle = angleBetween(lastPoint, currentPoint),
              x, y;
          
          for (var i = 0; i < dist; i++) {
              x = lastPoint.x + (Math.sin(angle) * i) - 0;
              y = lastPoint.y + (Math.cos(angle) * i) - 0;
              // ctx.globalCompositeOperation = 'destination-out';
              ctx.fillStyle = this.state.background;
              ctx.beginPath();
              ctx.rect(x, y, 5,5);
              ctx.fill();
              
              // ctx.drawImage(brush, x, y);
          }
          
          lastPoint = currentPoint;
          handlePercentage(getFilledInPixels(32));
        }

        function handleMouseUp(e) {
        isDrawing = false;
        }
    }
    render() {
        return (
          <div>
            <canvas ref="canvas" width={300} height={300}/><br/>
            <button onClick={this.updateCanvas.bind(this)}>Clear</button>
            <button onClick={()=>{
                var link = document.createElement('a');
                link.download = 'image.png';
                link.href = this.refs.canvas.toDataURL()
                link.click();
              }
            }>Downlaod</button>
            <SketchPicker 
                color={ this.state.background }
                onChangeComplete={ this.handleChangeComplete }/>
          </div>  
        );
    }
}
ReactDOM.render(<CanvasComponent/>, document.getElementById('root'));