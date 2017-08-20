import "../assets/css/app/index.css"
import "./index.scss"
import "../emitter.js"

function component() {
  var element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = "sds";

  return element;
}

document.body.appendChild(component());