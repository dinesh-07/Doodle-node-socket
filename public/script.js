// Initialize socket
const socket = io("http://localhost:7001/");
// Get context of canvas.
const canvas = document.querySelector(".whiteboard");
const context = canvas.getContext("2d");

// Configuration
let drawing = false,
  current = { color: "black" };

/*
Mouse Events for mouse.
mousedown
mouseout / mouseup
mouseover

Touch events for Mobile.
touchstart
touchend / touchcancel
touchmove
*/
mousedown = (e) => {
  drawing = true;
  current.x = e.clientX || e.touches[0].clientX;
  current.y = e.clientY || e.touches[0].clientY;
};

mouseup = (e) => {
  if (!drawing) {
    return;
  }
  drawing = false;
  drawline(
    current.x,
    current.y,
    e.clientX || e.touches[0].clientX,
    e.clientY || e.touches[0].clientY,
    current.color,
    true
  );
};

mousemove = (e) => {
  if (!drawing) {
    return;
  }
  drawline(
    current.x,
    current.y,
    e.clientX || e.touches[0].clientX,
    e.clientY || e.touches[0].clientY,
    current.color,
    true
  );
};

drawline = (x0, y0, x1, y1, color, emit) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.stroke();
  context.closePath();
};
