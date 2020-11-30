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
  if (!emit) {
    return;
  }
  const width = canvas.width;
  const height = canvas.height;

  socket.emit("drawing", {
    x0: x0 / width,
    y0: y0 / height,
    x1: x1 / width,
    y1: y1 / height,
    color,
  });
};

// Throttle function
function throttle(callback, delay) {
  let previousCall = new Date().getTime();
  return function () {
    const time = new Date().getTime();
    if (time - previousCall >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

// Canvas mouse events listeners
canvas.addEventListener("mousedown", mousedown, false);
canvas.addEventListener("mouseup", mouseup, false);
canvas.addEventListener("mousemove", throttle(mousemove, 10), false);
canvas.addEventListener("mouseout", mouseup, false);

// Mobile event
canvas.addEventListener("touchstart", mousedown, false);
canvas.addEventListener("touchend", mouseup, false);
canvas.addEventListener("touchmove", throttle(mousemove, 10), false);
canvas.addEventListener("touchcancel", mouseup, false);

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", onResize, false);
onResize();

socket.on("drawing", onDrawingEvent);

function onDrawingEvent(data) {
  const w = canvas.width;
  const h = canvas.height;
  drawline(data.x0 * w, data.y0 * h, data.x1 * w, data.y1, data.color);
}
