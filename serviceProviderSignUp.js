document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signupButton").addEventListener("click", serviceProviderSignup);
});

async function serviceProviderSignup() {         
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    if (!email || !password) {
        messageElement.textContent = "All fields are required!";
        messageElement.style.color = "red";
        return;
    }

    // Generate a unique 5-digit code
    const uniqueCode = Math.floor(10000 + Math.random() * 90000);

    try {
        const response = await fetch("http://localhost:5000/api/service-provider/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, uniqueCode }),
        });

        const data = await response.json();
        if (response.ok) {
            messageElement.textContent = `Signup successful! Your unique code: ${uniqueCode}. Redirecting...`;
            messageElement.style.color = "green";
            setTimeout(() => {
                window.location.href = "serviceProviderSignIn.html";
            }, 3000);
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