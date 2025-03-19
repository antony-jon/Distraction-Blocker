document.addEventListener("DOMContentLoaded",()=>{
    const first=document.getElementById("First");
    const User=document.getElementById("User")
    const user=document.getElementById("user");
    user.addEventListener("click",()=>{
        first.style.display="none";
        User.style.display="block";
    });
});
        
