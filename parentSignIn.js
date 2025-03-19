document.addEventListener("DOMContentLoaded", function () {
    const signInButton = document.getElementById("signInSubmit");

    signInButton.addEventListener("click", function () {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please fill in both fields.");
            return;
        }

        // Send credentials to backend for validation
        fetch("http://localhost:5000/api/parent/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Login successful!");
                window.location.href = "parentDashboard.html"; // Redirect to dashboard
            } else {
                alert("Invalid credentials. Please try again.");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
