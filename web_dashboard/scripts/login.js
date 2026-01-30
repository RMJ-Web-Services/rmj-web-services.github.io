const submit = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");

submit.onclick = (event) => {
    event.preventDefault();
    login();
};

async function login() {
    try {
        const response = await fetch("https://api.rmjws.cz/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: email.value,
                password: password.value
            }),
            credentials: "include" // important for cookies
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Login failed:", text);
            alert("Login failed: " + text);
            return;
        }
        else {
            window.location.href = "../";
        }

        console.log("Login successful!");
        // Cookie is automatically stored by the browser
        // You can now call protected endpoints, cookies will be sent automatically
    } catch (err) {
        console.error("Fetch error:", err);
    }
}
