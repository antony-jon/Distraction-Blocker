document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signinButton").addEventListener("click", serviceProviderSignIn);
});

async function serviceProviderSignIn() {         
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    if (!email || !password) {
        messageElement.textContent = "All fields are required!";
        messageElement.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/service-provider/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            messageElement.textContent = "Login successful! Redirecting...";
            messageElement.style.color = "green";
            setTimeout(() => {
                window.location.href = "serviceProviderDashboard.html";
            }, 2000);
        } else {
            messageElement.textContent = data.message;
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        messageElement.textContent = "Server error, please try again later.";
        messageElement.style.color = "red";
    }
}
