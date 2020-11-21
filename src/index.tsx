import React from "react";
import ReactDOM from "react-dom";
import CanvasComponent from "./Components/CanvasComponent";
import registerServiceWorker from './serviceWorker';
import "./styles.css";

class Main extends React.Component {
  render() {
    return (
      <div className="main">
        <CanvasComponent />
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
registerServiceWorker();