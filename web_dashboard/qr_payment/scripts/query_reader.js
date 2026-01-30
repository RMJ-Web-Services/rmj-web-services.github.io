import init, { create_qr } from '../qr_creator/pkg/qr_creator.js';

const urlParams = new URLSearchParams(window.location.search);
const iban = urlParams.get('iban');
const order_id = urlParams.get('order_id');

async function fetchPrice(order_id) {
    try {
        const response = await fetch(`https://api.rmjws.cz/v1/get_price?id=${order_id}`);
        if (response.status === 200) {
            const text = await response.text();
            console.log("Fetched price:", text);
            return Number(text) || 0; // fallback if conversion fails
        } else {
            console.warn("Price request failed:", response.status);
            return 0;
        }
    } catch (err) {
        console.error("Fetch error:", err);
        return 0;
    }
}

async function initPage() {
    const amountInput = document.getElementById('amount');
    const messageInput = document.getElementById('message');

    messageInput.value = order_id;

    const price = await fetchPrice(order_id);
    amountInput.value = price;

    document.getElementById('generate').addEventListener('click', run);
}

async function run() {
    const amount = Number(document.getElementById('amount').value);
    const message = document.getElementById('message').value;

    if (!iban) {
        alert("Chybí IBAN v URL (?iban=...)");
        return;
    }

    await init();
    const svg = create_qr(iban, String(amount), message);
    document.getElementById("qr").innerHTML = svg;
}

// Initialize page
initPage();
