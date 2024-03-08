import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// importing css stylesheet to use the bootstrap class
// add this line only in this file
import "bootstrap/dist/css/bootstrap.min.css"; 

ReactDOM.render(
<React.StrictMode>
  <App />
</React.StrictMode>,
document.getElementById("root")
);
