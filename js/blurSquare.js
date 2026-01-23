const gridSize = 6;
const effectTimeoutMs = 800;

document.querySelectorAll('.applyBlurSquare').forEach(element => {
  applyEffect(element)
});



function getSquareStyles() {
  const position = randInt(0, 60);
  return {
    position: 'absolute',
    top: `${position}%`,
    left: `${position}%`,
    width: '40%',
    aspectRatio: '1 / 1',
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    zIndex: '100',
    border: '1px solid white',
  };
}

function getChildStyles() {
  const blur = randInt(1, 16);
  const saturation = randInt(2, 25) / 10;
  const contrast = randInt(6, 18) / 10;
  const hue = randInt(0, 60) - 30;
  return {
    width: '100%',
    height: '100%',
    zIndex: '1',
    backdropFilter: `blur(${blur}px) saturate(${saturation}) contrast(${contrast}) hue-rotate(${hue}deg)`,
  };
}

function applyEffect(element) {
  element.style.position = 'relative';
  const square = document.createElement('div');
  Object.assign(square.style, getSquareStyles());
  element.appendChild(square);
  refreshKids(square);
  setInterval(() => refreshKids(square), effectTimeoutMs)
}

function refreshKids(square) {
  square.innerHTML = "";
  for (let i = 0; i < gridSize**2; i++) {
    const child = document.createElement('div');
    Object.assign(child.style, getChildStyles());
    square.appendChild(child);
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
