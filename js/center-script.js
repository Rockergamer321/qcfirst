window.onload = function(){
//First Modal(s)
var modal = document.getElementsByClassName("modal")[0];
var img = document.getElementsByClassName("info-button")[0];
var span = document.getElementsByClassName("close")[0];

img.onclick = function() {
  modal.style.display = "block";
};
span.onclick = function() {
  modal.style.display = "none";
};

var button = document.getElementsByClassName("delete-button")[0];
var removeModal = document.getElementsByClassName("drop-modal")[0];
var closeDrop = document.getElementsByClassName("close")[1];
var noButton = document.getElementsByClassName("no-button")[0];

button.onclick = function() {
    removeModal.style.display = "block";
};

closeDrop.onclick = function() {
    removeModal.style.display = "none";
};

noButton.onclick = function() {
    removeModal.style.display = "none";
};

//------------------------------------------
//Second Modal
var modal2 = document.getElementsByClassName("modal")[1];
var img2 = document.getElementsByClassName("info-button")[1];
var span2 = document.getElementsByClassName("close")[2];

img2.onclick = function() {
  modal2.style.display = "block";
};
span2.onclick = function() {
  modal2.style.display = "none";
};

var button2 = document.getElementsByClassName("delete-button")[1];
var removeModal2 = document.getElementsByClassName("drop-modal")[1];
var closeDrop2 = document.getElementsByClassName("close")[3];
var noButton2 = document.getElementsByClassName("no-button")[1];

button2.onclick = function() {
    removeModal2.style.display = "block";
};

closeDrop2.onclick = function() {
    removeModal2.style.display = "none";
};

noButton2.onclick = function() {
    removeModal2.style.display = "none";
};

//Third Modal
var modal3 = document.getElementsByClassName("modal")[2];
var img3 = document.getElementsByClassName("info-button")[2];
var span3 = document.getElementsByClassName("close")[4];

img3.onclick = function() {
  modal3.style.display = "block";
};
span3.onclick = function() {
  modal3.style.display = "none";
};

var button3 = document.getElementsByClassName("delete-button")[2];
var removeModal3 = document.getElementsByClassName("drop-modal")[2];
var closeDrop3 = document.getElementsByClassName("close")[5];
var noButton3 = document.getElementsByClassName("no-button")[2];

button3.onclick = function() {
    removeModal3.style.display = "block";
};

closeDrop3.onclick = function() {
    removeModal3.style.display = "none";
};

noButton3.onclick = function() {
    removeModal3.style.display = "none";
};

//Fourth Modal
var modal4 = document.getElementsByClassName("modal")[3];
var img4 = document.getElementsByClassName("info-button")[3];
var span4 = document.getElementsByClassName("close")[6];

img4.onclick = function() {
  modal4.style.display = "block";
};
span4.onclick = function() {
  modal4.style.display = "none";
};

var button4 = document.getElementsByClassName("delete-button")[3];
var removeModal4 = document.getElementsByClassName("drop-modal")[3];
var closeDrop4 = document.getElementsByClassName("close")[7];
var noButton4 = document.getElementsByClassName("no-button")[3];

button4.onclick = function() {
    removeModal4.style.display = "block";
};

closeDrop4.onclick = function() {
    removeModal4.style.display = "none";
};

noButton4.onclick = function() {
    removeModal4.style.display = "none";
};

};