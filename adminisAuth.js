document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.getElementById("signUpBtn");
    const signInButton = document.getElementById("signInBtn");

    // Redirect to sign-up page
    signUpButton.addEventListener("click", function () {
        window.location.href = "serviceProviderSignup.html";
    });

    // Redirect to sign-in page
    signInButton.addEventListener("click", function () {
        window.location.href = "serviceProviderSignIn.html";
    });
});