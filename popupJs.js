document.addEventListener("DOMContentLoaded", function () {
    const adminButton = document.getElementById("admin");
    const userButton = document.getElementById("user");

    adminButton.addEventListener("click", function () {
        window.location.href = "adminHtml.html";
    });

    userButton.addEventListener("click", function () {
        window.location.href = "userCode.html";
    });
});
