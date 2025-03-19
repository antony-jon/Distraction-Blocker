document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signupButton").addEventListener("click", parentSignup);
});

async function parentSignup() {         
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageElement = document.getElementById("message");

    // Clear previous messages
    messageElement.textContent = "";
    messageElement.style.display = "none";

    if (!email || !password) {
        messageElement.textContent = "All fields are required!";
        messageElement.style.color = "red";
        messageElement.style.display = "block";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/parent/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            messageElement.textContent = "Signup successful! Redirecting...";
            messageElement.style.color = "green";
            messageElement.style.display = "block";

            // Clear input fields after successful signup
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";

            setTimeout(() => {
                window.location.href = "parentSignIn.html"; // Redirect to login page
            }, 2000);
        } else {
            messageElement.textContent = data.message || "Signup failed!";
            messageElement.style.color = "red";
            messageElement.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        messageElement.textContent = "Server error, please try again later.";
        messageElement.style.color = "red";
        messageElement.style.display = "block";
    }
}
