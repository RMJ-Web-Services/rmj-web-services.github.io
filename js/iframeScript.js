const frameParent = document.getElementById("frameParent");
const timerElement = document.getElementById("frameTimer");
const sources = [
  "https://jenyyk.github.io",
  "https://maturak26ab.cz",
];
// starts at -1, because it is immediately incremented to 0
let index = -1;
const frames = [];
let hovered = false;

function createIframe(src) {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  return iframe;
}

const circleIntervalTime = 8000; // ms
document.addEventListener("DOMContentLoaded", () => {
  for (s of sources) {
    const frame = createIframe(s);
    frames.push(frame);
    frameParent.insertBefore(frame, frameParent.firstChild);
  }
  circleFrameForward();
  animateTimer();
  setInterval(circleFrameForwardInterval, circleIntervalTime);
});

function circleFrameForwardInterval() {
  animateTimer();
  // we want to animate the timer to keep it synced, but not actually display the next iframe
  if (hovered) return;
  circleFrameForward();
}

function circleFrameForward() {
  index++;
  frames[index % frames.length].style.display = "block";
  try {
    frames[(index - 1) % frames.length].style.display = "none";
  } catch { /* give up */ }
}
function animateTimer() {
  animation = timerElement.animate([
    {
      backgroundPosition: "100%",
    },
    {
      backgroundPosition: "0%",
    },
  ], {
    duration: circleIntervalTime,
    iterations: 1,
    easing: "ease-in-out",
  });
}

frameParent.addEventListener("mouseover", () => {
  hovered = true;
});

frameParent.addEventListener("mouseout", () => {
  hovered = false;
});
