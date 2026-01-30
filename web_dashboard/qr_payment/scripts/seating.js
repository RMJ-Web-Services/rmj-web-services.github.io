const room = document.getElementById("room");
const amountInput = document.getElementById("amount");
const amountDisplay = document.getElementById("amount-current");
const amountDisplayMax = document.getElementById("amount-max");
const confirmBtn = document.getElementById("confirm");
const cartList = document.getElementById("cart-list");
const closePopUp = document.getElementById("notification-close");
const card = document.getElementById("notification-card");
const payBtn = document.getElementById("pay");
const emailInput = document.getElementById("email-input");
const emailVerification = document.getElementById("email-verification");

let email="";
let email_ver="";
let unit = 60;
let heightUnit = 60;
const MAX_TOTAL_SEATS = 10;

let roomWidthUnits = 2;
let roomHeightUnits = 2;

const tables = [];
const obstacles = [];

let activeTableEl = null;

/* =========================
   Helpers
========================= */
function getTotalSelectedSeats() {
  return [...document.querySelectorAll(".table")]
    .reduce((sum, el) => sum + Number(el.dataset.selectedSeats), 0);
}

function updateTableLabel(el) {
  const used = Number(el.dataset.selectedSeats);
  const max = Number(el.dataset.maxSeats);

  el.textContent = used > 0
    ? `${el.dataset.id} (${used}/${max})`
    : `${el.dataset.id} (${max})`;

  if (used > 0) {
    el.classList.add("checked");
  } else {
    el.classList.remove("checked");
  }

  renderCart();
}

async function fetchSeats() {
  try {
    const response = await fetch("https://api.rmjws.cz/v1/seats");

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data; // return the parsed object
  } catch (err) {
    console.error("Fetch failed:", err);
    return {};
  }
}


async function init_tables() {
  const json = await fetchSeats();
  const json_tables = json.tables;

  // Convert object values to an array
  const tableArray = Object.values(json_tables);
  const obstacleArray = Object.values(json.obstacles);

  tableArray.forEach(table => {
    if (Number(table.x) + Number(table.w) + 2 > roomWidthUnits) {
      roomWidthUnits = Number(table.x) + Number(table.w) + 2
    }
    if (Number(table.y) + Number(table.h) + 2 > roomHeightUnits) {
      roomHeightUnits = Number(table.y) + Number(table.h) + 2;
    }
    tables.push({
      id: table.id,
      x: table.x,
      y: table.y,
      w: table.w,
      h: table.h,
      seats: table.seats - table.reservedSeats,
      price: table.price,
    });
  });

  obstacleArray.forEach(obstacle => {
    if (Number(obstacle.x) + Number(obstacle.w) + 2 > roomWidthUnits) {
      roomWidthUnits = Number(obstacle.x) + Number(obstacle.w) + 2
    }
    if (Number(obstacle.y) + Number(obstacle.h) + 2 > roomHeightUnits) {
      roomHeightUnits = Number(obstacle.y) + Number(obstacle.h) + 2;
    }
    obstacles.push({
      id: obstacle.id,
      x: obstacle.x,
      y: obstacle.y,
      w: obstacle.w,
      h: obstacle.h,
    });
  });

  unit = (room.clientWidth || 700) / roomWidthUnits;
  heightUnit = (room.clientHeight || 420) / roomHeightUnits;

}

/* =========================
   Table creation
========================= */
function createTable(table) {
  const el = document.createElement("div");
  el.className = "table";

  el.style.left = table.x * unit + "px";
  el.style.top = table.y * heightUnit + "px";
  el.style.width = table.w * unit + "px";
  el.style.height = table.h * heightUnit + "px";

  el.dataset.id = table.id;
  el.dataset.maxSeats = table.seats;
  el.dataset.selectedSeats = 0;
  el.dataset.price = table.price;

  console.log(table.price);
  updateTableLabel(el);

  el.addEventListener("click", () => activateTable(el));

  return el;
}

function createObstacle(obstacle) {
  const el = document.createElement("div");
  el.className = "obstacle";

  el.style.left = obstacle.x * unit + "px";
  el.style.top = obstacle.y * heightUnit + "px";
  el.style.width = obstacle.w * unit + "px";
  el.style.height = obstacle.h * heightUnit + "px";

  el.dataset.id = obstacle.id;

  el.textContent = obstacle.id;

  return el;
}

/* =========================
    Cart logic
========================= */
function renderCart() {
  
  // Get all table elements in the DOM
  const tableEls = document.querySelectorAll(".table");

  // Filter only tables with selected seats
  const selectedTables = [...tableEls].filter(
    el => Number(el.dataset.selectedSeats) > 0
  );

  // Clear current cart
  cartList.innerHTML = "";

  let cartCost = 0;

  // If nothing selected
  if (Object.keys(selectedTables).length === 0) {
    const li = document.createElement("li");
    li.textContent = "No tables selected";
    li.style.textAlign = "center";
    li.style.fontStyle = "italic";
    li.style.color = "#888";
    cartList.appendChild(li);
    return;
  }

  // Add selected tables
  for (let table of selectedTables) {
    const li = document.createElement("li");

    let price = Number(table.dataset.price);
    let seats = Number(table.dataset.selectedSeats);
    let totalPrice = seats * price;
    cartCost += totalPrice;

    li.innerHTML = `
      <div class="cart-item-left">
        <strong>Table ${table.dataset.id}</strong>
        <small>${seats} seat${seats === 1 ? "" : "s"} × ${price.toFixed(2)}</small>
      </div>
      <div class="cart-item-right">
        <span class="cart-price">${totalPrice.toFixed(2)} Kč</span>
      </div>
    `;

    cartList.appendChild(li);
  }

  // Update total
  document.getElementById("cart-total").textContent = `${cartCost.toFixed(2)} Kč`;
}

/* =========================
   Selection logic
========================= */
function activateTable(el) {
  amountDisplay.textContent = 1;
  // If clicked table is already active, deactivate it
  if (activeTableEl === el) {
    el.classList.remove("selected");
    el.dataset.selectedSeats = 0;
    updateTableLabel(el);
    activeTableEl = null;
    amountInput.value = 1;
    return;
  }

  // Remove highlight from previous active table
  if (activeTableEl) {
    activeTableEl.classList.remove("selected");
  }

  // Check if max seats reached
  if (getTotalSelectedSeats() >= MAX_TOTAL_SEATS && Number(el.dataset.selectedSeats) === 0) {
    alert(`You can select a maximum of ${MAX_TOTAL_SEATS} seats.`);
    return;
  }

  if (el.dataset.maxSeats === "0") {
    alert("This table is fully booked.");
    return;
  }

  // Activate clicked table
  activeTableEl = el;
  el.classList.add("selected");

  const remainingSeats = MAX_TOTAL_SEATS - getTotalSelectedSeats() + Number(el.dataset.selectedSeats);
  amountInput.min = 1;
  amountInput.max = Math.min(el.dataset.maxSeats, remainingSeats);
  amountInput.value = el.dataset.selectedSeats || 1;

  amountDisplay.textContent = Math.max(el.dataset.selectedSeats || 1, 1);
  amountDisplayMax.textContent = Math.min(el.dataset.maxSeats, remainingSeats);

  if (el.dataset.selectedSeats === "0") {
    el.dataset.selectedSeats = 1;
    updateTableLabel(el);
  }
}

/* =========================
   Seat amount handling
========================= */
amountInput.addEventListener("input", () => {
  amountDisplay.textContent = amountInput.value || 1;
  if (!activeTableEl) return;

  const current = Number(activeTableEl.dataset.selectedSeats);
  const next = Number(amountInput.value);
  const totalWithoutCurrent = getTotalSelectedSeats() - current;

  if (totalWithoutCurrent + next > MAX_TOTAL_SEATS) {
    alert(`You can select a maximum of ${MAX_TOTAL_SEATS} seats.`);
    amountInput.value = current;
    return;
  }

  activeTableEl.dataset.selectedSeats = next;
  updateTableLabel(activeTableEl);
});

emailInput.addEventListener("input", () => {
  email = emailInput.value;
})

emailVerification.addEventListener("input", () => {
  email_ver = emailVerification.value;
})

function showNotificationCard(title, message, type = "success") {
  const titleEl = document.getElementById("notification-title");
  const messageEl = document.getElementById("notification-message");

  card.className = `notification-card show ${type}`;
  titleEl.textContent = title;
  messageEl.innerHTML = message;
}

closePopUp.addEventListener("click", () => {
  card.className = `notification-card hidden`;
})

payBtn.addEventListener("click", () => {
  const order = JSON.parse(localStorage.getItem("order"));
  window.location.href = "/qr_payment/subpages/iframe_tester.html?order_id=" + encodeURIComponent(order.id);
})

/* =========================
   Confirm
========================= */
confirmBtn.addEventListener("click", async () => {
  const selectedTables = [...document.querySelectorAll(".table")]
    .filter(el => Number(el.dataset.selectedSeats) > 0);

  const totalSeats = getTotalSelectedSeats();

  if (email === emailVerification) {
    alert("NON matching emails");
    return;
  }
  if (totalSeats === 0) {
    alert("Please select at least one seat.");
    return;
  }

  if (email === "") {
    alert("Please enter your email.");
    return;
  }

  let query = `email=${email}&`;
  for (const el of selectedTables) {
    query = query + `${el.dataset.id}=${el.dataset.selectedSeats}&`;
    el.dataset.selectedSeats = 0;
    el.classList.remove("selected");
    el.classList.remove("checked");
  }

  const orderID = await fetch(
      `https://api.rmjws.cz/v1/reserve_seats?${query}`
      ).then(response => {
        switch (response.status) {
          case 200:
            console.log("Success!");
            return response.text(); // or .text(), depending on your response type
          case 400:
            console.error("Bad request: Table not found");
            break;
          case 500:
            console.error("Internal server error");
            break;
          default:
            console.warn("Unexpected status:", response.status);
        }
      })
      .catch(error => {
        console.error("Network or fetch error:", error);
      });

  const order = { id: orderID};
  localStorage.setItem('order', JSON.stringify(order));
  showNotificationCard("Success", "Your order ID: <strong>" + orderID + "</strong>", "success");

  await init_tables();
  tables.forEach(table => {
    room.appendChild(createTable(table));
  });
});



/* =========================
   Init
========================= */
await init_tables();

tables.forEach(table => {
  room.appendChild(createTable(table));
});

obstacles.forEach(obstacle => {
  room.appendChild(createObstacle(obstacle));
})

