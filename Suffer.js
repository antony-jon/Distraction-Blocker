document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("passwordInput");
    const submitButton = document.getElementById("submitPassword");
    const errorMessage = document.getElementById("errorMessage");


    passwordInput.addEventListener("input", function () {
        submitButton.disabled = !passwordInput.value.trim();
    });

    submitButton.addEventListener("click", async function () {
        const enteredPassword = passwordInput.value.trim();
        if (!enteredPassword) {
            alert("Please enter a valid password!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/parent/verify-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email : localStorage.getItem("userEmail"), password: enteredPassword })
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error("Invalid JSON response from server.");
            }

            if (response.ok && data.success) {
                chrome.storage.sync.remove("adminCode", function () {
                    alert("Block turned off successfully!");
                    window.location.href = "popup.html"; // Redirect to main page
                });
            } else {
                errorMessage.style.display = "block"; // Show error message
                passwordInput.value = ""; // Clear input for security
            }
        } catch (error) {
            console.error("Error verifying password:", error);
            alert("Something went wrong. Please check the server.");
        }
    });
});
