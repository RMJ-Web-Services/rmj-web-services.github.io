import { renderTable } from "./table.js";
import { showYeller, EntryType, showMailChanger } from "./reassurer.js";

let titles = ["id", "price", "email", "buy date", "status"];
let rows_default = [
  ["1002", "$25", "b@test.com", "2025-02-14", "OK"],
  ["1003", "$40", "c@test.com", "2025-03-10", "Error"],
  ["1004", "$35", "d@test.com", "2025-04-01", "OK"],
  ["1005", "$50", "e@test.com", "2025-05-05", "Payment Returned"],
  ["1006", "$20", "f@test.com", "2025-06-12", "OK"],
  ["1007", "$45", "g@test.com", "2025-07-20", "Error"],
  ["1008", "$30", "h@test.com", "2025-08-15", "OK"],
  ["1009", "$55", "i@test.com", "2025-09-01", "Payment Returned"],
  ["1010", "$60", "j@test.com", "2025-10-10", "OK"],
  ["1011", "$15", "k@test.com", "2025-11-05", "Error"],

  ["1002", "$25", "b@test.com", "2025-02-14", "OK"],
  ["1003", "$40", "c@test.com", "2025-03-10", "Error"],
  ["1004", "$35", "d@test.com", "2025-04-01", "OK"],
  ["1005", "$50", "e@test.com", "2025-05-05", "Payment Returned"],
  ["1006", "$20", "f@test.com", "2025-06-12", "OK"],
  ["1007", "$45", "g@test.com", "2025-07-20", "Error"],
  ["1008", "$30", "h@test.com", "2025-08-15", "OK"],
  ["1009", "$55", "i@test.com", "2025-09-01", "Payment Returned"],
  ["1010", "$60", "j@test.com", "2025-10-10", "OK"],
  ["1011", "$15", "k@test.com", "2025-11-05", "Error"],
  ["1011", "$15", "k@test.com", "2025-11-05", "Error"],
];
let rows = [[]];
let right;
async function fetchBlockingJson(url) {
  try {
    // This will "pause" until the fetch resolves
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Fetch failed:', err);
    return null;
  }
}

async function editMail(index, new_email, database_id) {
  const response = await fetch("https://api.rmjws.cz/v1/customer/edit_mail", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      index: index,
      new_email: new_email,
      database_id: database_id
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Request failed");
    return res.json(); // or res.text()
  })
  .then(data => console.log("Server response:", data))
  .catch(err => console.error("Error:", err));
}

function parseTo2DArray(data){
  if (data && Array.isArray(data)) {
    return data.map(obj => [
      obj.id,
      obj.price + " Kč",
      obj.email,
      obj.date,
      obj.status
    ]);
  }
}

// Usage:
async function render() {
  rows =[[]];
  loader.style.display = "flex";
  console.log('Fetching...');
  const result = await fetchBlockingJson(`https://api.rmjws.cz/v1/customer/get_database/${params.get("id")}`);
  if (result) {
    rows = parseTo2DArray(result.tickets);
    console.log('set')
  }
  else {
    alert("failed to fetch data");
    rows = rows_default;
  }
  
  selected_ticket = [];
  selected_index = -1;
  renderUI();
  loader.style.display = "none";

}

const params = new URLSearchParams(window.location.search);
const database_id = params.get("id");


let selected_ticket = [];
let selected_index = -1;
let paused = false;
let should_yell = false;

const app = document.getElementById("app");

function leave() { 
  window.location.replace("../index.html");
}

function refresh() { render(); }
async function edit_email(index, newEmail) {
  try {
    // Wait for server response before updating UI
    const result = await editMail(index, newEmail, database_id);
    console.log(result);

    // Only update local rows & render after successful response
    rows[index][2] = newEmail;
    render();
  } catch (err) {
    console.error('Failed to edit email:', err);
  }
}
function resend_email(index) {
  alert("Resent ticket " + rows[index][0]);
}

function renderUI() {
  app.innerHTML = "";

  const root = document.createElement("div");
  root.className = "root";

  const currentTheme =
    document.documentElement.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

  const top = document.createElement("div");
  top.className = "topbar";
  const logo = document.createElement("img");
  logo.src = currentTheme === "light" ? "../assets/RMJ_light.svg" : "../assets/RMJ_dark.svg";
  console.log(currentTheme);

  top.appendChild(logo);

  // Main
  const main = document.createElement("div");
  main.className = "main";
  
  const loader = document.createElement("img");
  loader.src = "../assets/RMJ_dark copy.svg";
  loader.id = "loader";

  const left = document.createElement("div");
  left.className = "leftbar";
  const leaveBtn = document.createElement("button");
  leaveBtn.textContent = "leave";
  leaveBtn.classList.add("leave-button");
  leaveBtn.onclick = leave;
  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "refresh";
  refreshBtn.classList.add("refresh-button");
  refreshBtn.onclick = refresh;
  const createTicketBtn = document.createElement("button");
  createTicketBtn.textContent = "create new ticket";
  createTicketBtn.classList.add("create-ticket-button");
  createTicketBtn.onclick = create_ticket;
  left.appendChild(leaveBtn);
  left.appendChild(createTicketBtn);
  left.appendChild(refreshBtn);

  const center = document.createElement("div");
  center.className = "main-content";

  const table = document.createElement("div");
  table.id = "table";
  center.appendChild(table);

  renderTable(center, {
    titles,
  rows,
  disabled: paused || should_yell,
  selectedIndex: selected_index, // pass selected index
    onSelect(ticket, index) {
        selected_ticket = ticket;
        selected_index = index;
        updateRightPanel();
    }
  });

  right = document.createElement("div");
  right.className = "rightbar";

  main.appendChild(left);
  main.appendChild(center);
  main.appendChild(right);
  main.append(loader);


  root.appendChild(top);
  root.appendChild(main);
  app.appendChild(root);

  updateRightPanel();
  
  const scrollElement = document.querySelector('.scroll');
  const header = document.querySelector('.header');

  if (scrollElement.scrollHeight > scrollElement.clientHeight) {
    header.classList.add("active");   // add the class
  } else {
    header.classList.remove("active"); // remove the class 
  }

  if (paused) {
    showMailChanger({
        titleName: "change email",
        contents: [[EntryType.TEXT, ["email", "e-mail:", selected_ticket[2] || ""]]],
        onConfirm(email) {
          paused = false;
          edit_email(parseInt(selected_ticket[0]), email[0]); // edit_email already calls render()
        },
        onCancel() {
          paused = false;
          renderUI(); // render once
        }
    });
  }
  
  if (should_yell) {
    showYeller({
        reassure_text: `This will send an email to ${selected_ticket[2]} with ticket ${selected_ticket[0]}. Are you sure?`,
        onResponse(answer) {
          should_yell = false;
          if (answer) resend_email(selected_index); // can call render inside
          renderUI(); // render once to update UI
        }
    });
  }
}

function updateRightPanel() {
  const right = document.querySelector(".rightbar");
  if (!right) {
    console.log("no right found");
    return;
  }
  right.innerHTML = ""; // clear old info

  const fields = [
    ["Ticket number:", selected_ticket[0] || ""],
    ["E-mail:", selected_ticket[2] || ""],
    ["Bought date:", selected_ticket[3] || ""],
  ];

  const ticketImg = document.createElement("img");
  ticketImg.src = "../assets/cropped.png";
  right.appendChild(ticketImg);

  fields.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.innerHTML = `<span class="rightLabel">${label}</span><span class="rightValue">${value}</span>`;
    right.appendChild(row);
  });



  
  const editBtn = document.createElement("button");
  editBtn.textContent = "edit e-mail";
  editBtn.disabled = selected_ticket.length === 0;
  editBtn.onclick = () => {
    paused = true;
    renderUI();
  };

  const resendBtn = document.createElement("button");
  resendBtn.textContent = "resend email";
  resendBtn.disabled = selected_ticket.length === 0;
  resendBtn.onclick = () => {
    should_yell = true;
    renderUI();
  };

  const deleteBtn = document.createElement("button");
  console.log(selected_ticket[4]);
  deleteBtn.textContent = selected_ticket[4] == "deleted" ? "revive ticket" : "delete ticket";
  deleteBtn.disabled = selected_ticket.length === 0;
  deleteBtn.onclick = () => {
    delete_ticket()
    renderUI();
  };


  right.appendChild(editBtn);
  right.appendChild(resendBtn);
  right.appendChild(deleteBtn);
}

function create_ticket() {
  showMailChanger({
    titleName: "manually add a ticket",
    contents: [
      [EntryType.TEXT, ["text", "seat", ""]], 
      [EntryType.TEXT, ["number", "price", ""]], 
      [EntryType.TEXT, ["email", "email", ""]]
    ],
    onConfirm: ([seat, price, email]) => post_create_ticket(seat, price, email),
    onCancel: () => console.log("Cancelled")
  });
}

async function post_create_ticket(seat = null, price = null, address = null) {
  fetch("https://api.rmjws.cz/v1/customer/create_ticket", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_id: database_id,
      seat: seat,
      price: parseInt(price),
      address: address,
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Request failed");
    return res.json(); // or res.text()
  })
  .then(refresh())
  .catch(err => console.error("Error:", err));
}

async function delete_ticket() {
  fetch("https://api.rmjws.cz/v1/customer/toggle_ticket", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      database_id: database_id,
      index: parseInt(selected_ticket[0]),
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Request failed");
    return res.json(); // or res.text()
  })
  .then(refresh())
  .catch(err => console.error("Error:", err));
}

renderUI();
render();
