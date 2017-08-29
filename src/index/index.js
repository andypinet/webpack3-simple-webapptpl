import "../assets/css/app/index.css"
import "./index.scss"

function component(content = "sds") {
  var element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = content;

  return element;
}


document.body.appendChild(component());