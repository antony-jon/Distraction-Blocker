document.addEventListener("DOMContentLoaded", function () {
    const parentButton = document.getElementById("parentMode");
    const serviceProviderButton = document.getElementById("serviceProviderMode");

    // Redirect to parent sign-in/sign-up page
    parentButton.addEventListener("click", function () {
        window.location.href = "parentAuth.html";
    });

    // Redirect to service provider dashboard
    serviceProviderButton.addEventListener("click", function () {
        window.location.href = "adminisAuth.html";
    });
});
