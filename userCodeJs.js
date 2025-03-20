document.addEventListener("DOMContentLoaded", function () {
    const codeInput = document.getElementById("adminCodeInput");
    const submitButton = document.getElementById("submitButton");

    codeInput.addEventListener("input", function () {
        submitButton.disabled = !codeInput.value.trim();
    });

    submitButton.addEventListener("click", async function () {
        const enteredCode = codeInput.value.trim();
        if (!enteredCode) {
            alert("Please enter a valid code!");
            return;
        }

        try {
            // ✅ Send a POST request with JSON body
            const response = await fetch("http://localhost:5000/api/service-provider/verify-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: enteredCode }),
            });

            if (!response.ok) {
                throw new Error("Server error. Try again later.");
            }

            const data = await response.json();

            if (!data.success) {
                alert("Invalid admin code! Please try again.");
                return;
            }

            // ✅ Store entered code in localStorage
            localStorage.setItem("enteredAdminCode", enteredCode);

            // ✅ Store the token for authentication
            localStorage.setItem("adminToken", data.token);

            // ✅ Redirect to another page
            window.location.href = "sufferUser.html";

        } catch (error) {
            console.error("Error verifying admin code:", error);
            alert("Something went wrong. Please try again later.");
        }
    });
});
