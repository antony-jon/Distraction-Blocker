document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.getElementById("signUpBtn1");
    const signInButton = document.getElementById("signInBtn1");

    // Redirect to sign-up page
    signUpButton.addEventListener("click", function () {
        window.location.href = "serviceProviderSignup.html";
    });

    // Redirect to sign-in page
    signInButton.addEventListener("click", function () {
        window.location.href = "serviceProviderSignIn.html";
    });
});
