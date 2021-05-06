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
    
    //Phone Modal
    var phoneModal = document.getElementsByClassName("modal")[1];
    var openPhone = document.getElementsByClassName("change-button")[1];
    var closePhone = document.getElementsByClassName("close")[1];
    
    openPhone.onclick = function() {
        phoneModal.style.display = "block";
    };
    closePhone.onclick = function() {
        phoneModal.style.display = "none";
    };
};