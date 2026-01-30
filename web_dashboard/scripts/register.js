const submit = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordRepeat = document.getElementById("password-repeat");

submit.onclick = async (event) => {
    event.preventDefault();

    try {
        const result = await register();

        if (result.success) {
            window.location.href = "./login.html";
        } else {
            console.error(result.message);
            alert(result.message); // or show it in the UI instead
        }

    } catch (err) {
        console.error("Network or server error:", err);
        alert("Could not connect to server.");
    }
};

async function register() {
    if (password.value !== passwordRepeat.value) {
        return { success: false, message: "Passwords do not match." };
    }

    const response = await fetch("https://api.rmjws.cz/v1/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: email.value,
            password: password.value
        })
    });

    // Try to parse JSON, but don't crash if server sends no JSON
    let data = null;
    try {
        data = await response.json();
    } catch {}

    switch (response.status) {
        case 200: 
            return {
                success: true,
                message: data?.message || "Registration successful"
            }
            break;
        case 409:
            return {
                success: false,
                message: "this username is already used, please pick a different one",
            }
            break;
        default: 
            return {
                success: false,
                message: data?.error || `Registration failed (${response.status})`
            };
    }
}



