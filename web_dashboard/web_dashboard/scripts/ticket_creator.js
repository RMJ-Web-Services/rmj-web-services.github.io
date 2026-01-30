const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const image = document.getElementById("image");
const numberBox = document.getElementById("number-box");
const addNumberBtn = document.getElementById("add-number");
const saveBtn = document.getElementById("save");
const closeBtn = document.getElementById("close");


/*
  Box is stored in NORMALIZED image coordinates (0–1)
  { x, y, width, height }
*/
let box = null;

let mode = "idle"; // idle | drawing | moving
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

/* ---------------- Image upload ---------------- */

upload.addEventListener("change", () => {
  const file = upload.files[0];
  if (!file) return;

  image.src = URL.createObjectURL(file);

  image.onload = () => {
    box = null;
    numberBox.style.display = "none";
  };
});

/* ---------------- Helpers ---------------- */

function mouseToImageNorm(e) {
  const r = image.getBoundingClientRect();

  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;

  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y))
  };
}

function getImageDataURL() {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  return canvas.toDataURL("image/png");
}

/* ---------------- Render ---------------- */

function renderNumberBox() {
  if (!box || !image.complete) return;

  const r = image.getBoundingClientRect();

  const screenX = r.left + box.x * r.width;
  const screenY = r.top + box.y * r.height;
  const screenW = box.width * r.width;
  const screenH = box.height * r.height;

  numberBox.style.display = "flex";
  numberBox.style.left = screenX + "px";
  numberBox.style.top = screenY - 41 + "px"; //I dont know why, but for some reason the image is showing an offset of 41px D:
  numberBox.style.width = screenW + "px";
  numberBox.style.height = screenH + "px";

  // Auto-fit text
  const sizeByHeight = screenH * 0.8;
  const sizeByWidth =
    screenW / numberBox.textContent.length * 1.8;

  numberBox.style.fontSize =
    Math.min(sizeByHeight, sizeByWidth) + "px";
}

/* ---------------- Create box ---------------- */

addNumberBtn.addEventListener("click", () => {
  if (!image.complete) return;
  mode = "drawing";
  box = null;
});

/* ---------------- Mouse events ---------------- */

canvas.addEventListener("mousedown", (e) => {
  if (!image.complete) return;

  if (mode === "drawing") {
    const p = mouseToImageNorm(e);
    startX = p.x;
    startY = p.y;
    box = { x: startX, y: startY, width: 0, height: 0 };
  }

  else if (e.target === numberBox && box) {
    mode = "moving";
    const p = mouseToImageNorm(e);
    offsetX = p.x - box.x;
    offsetY = p.y - box.y;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!box || !image.complete) return;

  if (mode === "drawing") {
    const p = mouseToImageNorm(e);

    box.x = Math.min(startX, p.x);
    box.y = Math.min(startY, p.y);
    box.width = Math.abs(p.x - startX);
    box.height = Math.abs(p.y - startY);

    renderNumberBox();
  }

  else if (mode === "moving") {
    const p = mouseToImageNorm(e);

    box.x = Math.max(0, Math.min(1 - box.width, p.x - offsetX));
    box.y = Math.max(0, Math.min(1 - box.height, p.y - offsetY));

    renderNumberBox();
  }


});

window.addEventListener("mouseup", () => {
  mode = "idle";
});

/* ---------------- Resize safe ---------------- */

window.addEventListener("resize", renderNumberBox);

/* ---------------- Save ---------------- */

saveBtn.addEventListener("click", () => {
  if (!box) return alert("No box!");

  const saved = {
    x: Math.round(box.x * image.naturalWidth),
    y: Math.round(box.y * image.naturalHeight),
    width: Math.round(box.width * image.naturalWidth),
    height: Math.round(box.height * image.naturalHeight)
  };

  const imageData = getImageDataURL();

  console.log(imageData);
  window.opener.postMessage(
    {
      type: "numberBoxSaved",
      payload: {
        image: imageData,
        box: saved
      }
    },
    "*"
  );

  window.close();
});


closeBtn.addEventListener("click", () => {
  window.close();
});
