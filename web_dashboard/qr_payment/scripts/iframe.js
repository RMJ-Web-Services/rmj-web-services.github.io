const baseUrl = "http://127.0.0.1:5501/qr_payment/index.html?iban=CZ6508000000192000145399&";
const iframe = document.getElementById("paymentFrame");
let id = new URLSearchParams(window.location.search).get('order_id');

if (!id) {
    id = JSON.parse(localStorage.getItem('order'));
}

iframe.src = `${baseUrl}&order_id=${id}`;