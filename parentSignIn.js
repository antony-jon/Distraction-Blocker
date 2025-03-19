document.getElementById("signInForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/parent/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            alert("Sign in successful!");
            window.location.href = "dashboard.html";  // Redirect to dashboard
        } else {
            document.getElementById("errorMessage").textContent = data.message;
            document.getElementById("errorMessage").style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("errorMessage").textContent = "Server error. Try again later.";
        document.getElementById("errorMessage").style.display = "block";
    }
});
