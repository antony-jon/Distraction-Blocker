document.getElementById("signInForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

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
            localStorage.setItem("userType", "Parent");
            localStorage.setItem("userEmail", email);
            window.location.href = "Suffer.html"; 
        } else {
            errorMessage.textContent = data.message;
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "Server error. Try again later.";
        errorMessage.style.display = "block";
    }
});
