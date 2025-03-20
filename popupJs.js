document.addEventListener("DOMContentLoaded", function () {
    const adminButton = document.getElementById("admin");
    const userButton = document.getElementById("user");
    const userDiv = document.getElementById("User");
    const firstDiv = document.getElementById("First");
    const userSubmit = document.getElementById("userSubmit");
    const codeInput = document.getElementById("code");

    
    userDiv.style.display = "none";

    adminButton.addEventListener("click", function () {
        window.location.href = "adminHtml.html";
    });

    // User button click event - Show input field for admin code
    userButton.addEventListener("click", function () {
        firstDiv.style.display = "none";
        userDiv.style.display = "block";
    });

    // User submit button click event
    userSubmit.addEventListener("click", function () {
        const enteredCode = codeInput.value.trim();

        if (enteredCode) {
            // Store code in chrome storage (for extension use)
            chrome.storage.sync.set({ adminCode: enteredCode }, function () {
                console.log("Admin code saved:", enteredCode);
            });

            // Redirect to userCode.html where the blocking logic will happen
            window.location.href = "userCode.html";
        } else {
            alert("Please enter a valid admin code!");
        }
    });
});