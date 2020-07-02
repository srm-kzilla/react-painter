import React from "react";
import ReactDOM from "react-dom";
import { SketchPicker } from 'react-color';
import "./styles.css";

class CanvasComponent extends React.Component {


    state = {
        background: '#121212',
        choice: 'brush',
        canvas: {} as HTMLCanvasElement,
    };

    handleChangeComplete = (color:any) => {
        this.setState({ background: color.hex });
    };

    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
        var isDrawing:any, lastPoint:any;
        var canvas:HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        canvas.width = window.innerWidth - 150;
        canvas.height = window.innerHeight;

        
        var canvasWidth:any          = canvas.width;
        var canvasHeight:any         = canvas.height;   
        var ctx:any                  = canvas.getContext('2d');
        
        var prevjob:any = {};
        var canvasPic:any;
        
        this.setState({ canvas: canvas });

        ctx.beginPath();
        ctx.rect(0, 0, canvasHeight, canvasWidth);
        ctx.fillStyle = "#fff";
        ctx.fill();
        canvas.addEventListener('mouseout', handleMouseOut.bind(this), false);
        canvas.addEventListener('mousedown', handleMouseDown.bind(this), false);
        canvas.addEventListener('touchstart', handleMouseDown.bind(this), false);
        canvas.addEventListener('mousemove', handleMouseMove.bind(this), false);
        canvas.addEventListener('touchmove', handleMouseMove.bind(this), false);
        canvas.addEventListener('mouseup', handleMouseUp.bind(this), false);
        canvas.addEventListener('touchend', handleMouseUp.bind(this), false);
        // canvas.addEventListener('mousedown', handleMouseDown, false);
        // canvas.addEventListener('touchstart', handleMouseDown, false);
        // canvas.addEventListener('mousemove', handleMouseMove, false);
        // canvas.addEventListener('touchmove', handleMouseMove, false);
        // canvas.addEventListener('mouseup', handleMouseUp, false);
        // canvas.addEventListener('touchend', handleMouseUp, false);

        function distanceBetween(point1:any, point2:any) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }

        function angleBetween(point1:any, point2:any) {
        return Math.atan2( point2.x - point1.x, point2.y - point1.y );
        }

        function getFilledInPixels(stride:any) {
        if (!stride || stride < 1) { stride = 1; }
        
        var pixels:any   = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
            pdata:any    = pixels.data,
            l:any        = pdata.length,
            total:any    = (l / stride),
            count:any    = 0;
        
        // Iterate over all pixels
        for(var i:any = count = 0; i < l; i += stride) {
            if (parseInt(pdata[i]) === 0) {
            count++;
            }
        }
        
        return Math.round((count / total) * 100);
        }

        function handleMouseOut(e:any) {
            isDrawing = false; 
        }
        

        function getMouse(e:any, canvas:any) {
        var offsetX:any = 0, offsetY:any = 0, mx:any, my:any;

        if (canvas.offsetParent !== undefined) {
            do {
            offsetX += canvas.offsetLeft;
            offsetY += canvas.offsetTop;
            } while ((canvas = canvas.offsetParent));
        }

        mx = (e.clientX || e.touches[0].clientX) + offsetX;
        my = (e.clientY || e.touches[0].clientY) + offsetY;

        return {x: mx, y: my};
        }

        function handlePercentage(filledInPixels:any) {
            filledInPixels = filledInPixels || 0;
            if (filledInPixels > 40) {
                // canvas.parentNode.removeChild(canvas);
                // $('#scratch-card-title').html(`Click the image to go to the Portal`);
            }
        }

        function handleMouseDown(e:any) {
        isDrawing = true;
        lastPoint = getMouse(e, canvas);
        prevjob = {done:false,x:0,y:0};
        }
        var pstate:any;
        function handleMouseMove(e:any) {
          if (!isDrawing) { return; }
          
          e.preventDefault();

          if(this.state.choice === 'rectangle'){
            if(prevjob.done === false){
                prevjob.done = true;
                pstate = canvas.toDataURL();
            }
            canvasPic = new Image();
            canvasPic.src = pstate;
            canvasPic.onload = ()=> { 
                let plvalx = (e.clientX || e.touches[0].clientX);
                let plvaly = (e.clientY || e.touches[0].clientY);
                ctx.drawImage(canvasPic, 0, 0); 
                ctx.fillStyle = this.state.background;
                ctx.beginPath();
                ctx.rect(lastPoint.x,lastPoint.y, plvalx-lastPoint.x,plvaly-lastPoint.y);
                ctx.fill();
                return ;   
            }
            return ;
          }

          if(this.state.choice === 'circle'){
            if(prevjob.done === false){
                prevjob.done = true;
                pstate = canvas.toDataURL();
            }
            canvasPic = new Image();
            canvasPic.src = pstate;
            canvasPic.onload = ()=> { 
                let plvalx = (e.clientX || e.touches[0].clientX);
                let plvaly = (e.clientY || e.touches[0].clientY);
                ctx.drawImage(canvasPic, 0, 0); 
                ctx.fillStyle = this.state.background;
                ctx.beginPath();
                ctx.arc(lastPoint.x,lastPoint.y,Math.max(Math.abs(plvalx-lastPoint.x),Math.abs(plvaly-lastPoint.y)), 0, 2 * Math.PI);
                ctx.fill();
                return ;   
            }
            return ;
          }

          var currentPoint:any = getMouse(e, canvas),
              dist:any = distanceBetween(lastPoint, currentPoint),
              angle:any = angleBetween(lastPoint, currentPoint),
              x:any, y:any;
          
          for (var i:any = 0; i < dist; i++) {
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

        function handleMouseUp(e:any) {
        isDrawing = false;
        }
    }
    render() {
        return (
          <div className='main'>
            <canvas id="canvas" ref="canvas" width="90%" height="90%"/>
            <div className='toolset'>
                <button onClick={()=>{
                    this.setState({ choice: 'brush' });
                }}>Brush</button>
                
                <button onClick={()=>{
                    this.setState({ choice: 'rectangle' });
                }}>Rectangle</button>
                
                <button onClick={()=>{
                    this.setState({ choice: 'circle' });
                }}>Circle</button>
                
                <button onClick={this.updateCanvas.bind(this)}>Clear</button>
                
                <button onClick={()=>{
                    var link:any = document.createElement('a');
                    link.download = 'image.png';
                    link.href = this.state.canvas.toDataURL()
                    link.click();
                  }
                }>Downlaod</button>
                <SketchPicker 
                    color={ this.state.background }
                    onChangeComplete={ this.handleChangeComplete }/>
            </div>    
          </div>  
        );
    }
}
ReactDOM.render(<CanvasComponent/>, document.getElementById('root'));