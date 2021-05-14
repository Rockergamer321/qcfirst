window.onload = function(){
    //Email Modal
    var emailModal = document.getElementsByClassName("modal")[0];
    var openEmail = document.getElementsByClassName("change-button")[0];
    var closeEmail = document.getElementsByClassName("close")[0];
    
    openEmail.onclick = function() {
        emailModal.style.display = "block";
    };
    closeEmail.onclick = function() {
        emailModal.style.display = "none";
    };
};