document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.getElementById("signUpBtn");
    const signInButton = document.getElementById("signInBtn");

    signUpButton.addEventListener("click", function () {
        window.location.href = "parentSignUp.html";
    });

    signInButton.addEventListener("click", function () {
        window.location.href = "parentSignIn.html";
    });
});
