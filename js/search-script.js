// ================
// Frontend Changes 
// ================

//Changes Notification Bell from White to Yellow (Desktop)
$('.notification-bell').click(function(){
    $(this).toggleClass('notification-bell notified-bell');
});

//Changes Notification Bell from White to Yellow (Mobile)
$('.mobile-notification').click(function(){
    $(this).toggleClass('mobile-notification mobile-notified');
});

//This changes the 1st course to unavailable on mobile view, in case it is full
var initialcourse = $("#courses option:first").val();
initialcourse = initialcourse.split("|");
if(initialcourse[5] <=0){
    document.getElementById("availability").innerHTML = "<h3>Availability Status: </h3> <img class=\"availability-icon\" src=\"img/Red_Circle.png\" height=40 width=40 alt=\"This Class is Currently Unavailable\"/>";
}
else{
    document.getElementById("availability").innerHTML = "<h3>Availability Status: </h3> <img class=\"availability-icon\" src=\"img/Green_Circle.png\" height=40 width=40 alt=\"This Class is Currently Available\"/> <input type=\"submit\" value=\"Enroll\">";   
}

//When a different course is selected, if it is full, this prevents a student from enrolling (Mobile)
$('#courses').on('change', function() {
    $(".mobile-notified").toggleClass('mobile-notification mobile-notified');
    var studentsenrolled = this.value.split("|");
    studentsenrolled = studentsenrolled[5];
    if(studentsenrolled > 0){
        document.getElementById("availability").innerHTML = "<h3>Availability Status: </h3> <img class=\"availability-icon\" src=\"img/Green_Circle.png\" height=40 width=40 alt=\"This Class is Currently Available\"/> <!--Submits Given Selection--> <input type=\"submit\" value=\"Enroll\">";
    }
    else{
        document.getElementById("availability").innerHTML = "<h3>Availability Status: </h3> <img class=\"availability-icon\" src=\"img/Red_Circle.png\" height=40 width=40 alt=\"This Class is Currently Unavailable\"/>";
    }
});
//==============================================================================
// ================
// Backend Changes 
// ================

//Gets Course Information from Table before adding Notification
$("table").on("click", ".notified-bell", function(){
    var row = $(this).closest('tr');
    var cells = row.find('td');
    var coursename = cells[0].innerText;
    var instructor = cells[1].innerText;
    var coursedays = cells[2].innerText;
    var coursetime = cells[3].innerText;
    addNotification(coursename, instructor, coursedays, coursetime);
});

//Gets Course Information from Table before removing Notification
$("table").on("click", ".notification-bell", function(){
    var row = $(this).closest('tr');
    var cells = row.find('td');
    var coursename = cells[0].innerText;
    var instructor = cells[1].innerText;
    var coursedays = cells[2].innerText;
    var coursetime = cells[3].innerText;
    removeNotification(coursename, instructor, coursedays, coursetime);
});

//Get Course Information from Mobile View before adding Notification
$("#mobile-enroll").on("click", ".mobile-notified", function(){
    var selectedcourse = $("#courses option:selected").val();
    selectedcourse = selectedcourse.split("|");
    var coursename = selectedcourse[0];
    var instructor = selectedcourse[1];
    var coursedays = selectedcourse[2];
    var coursetime = selectedcourse[3];
    addNotification(coursename, instructor, coursedays, coursetime);
});

//Get Course Information from Mobile View before removing Notification
$("#mobile-enroll").on("click", ".mobile-notification", function(){
    var selectedcourse = $("#courses option:selected").val();
    selectedcourse = selectedcourse.split("|");
    var coursename = selectedcourse[0];
    var instructor = selectedcourse[1];
    var coursedays = selectedcourse[2];
    var coursetime = selectedcourse[3];
    removeNotification(coursename, instructor, coursedays, coursetime);
});

//Gets Course Information from Table before enrolling
$("table").on("click", ".enroll-button", function(){
    var row = $(this).closest('tr');
    var cells = row.find('td');
    var coursename = cells[0].innerText;
    var instructor = cells[1].innerText;
    var coursedays = cells[2].innerText;
    var coursetime = cells[3].innerText;
    var course = coursename+"|"+instructor+"|"+coursedays+"|"+coursetime;
    console.log(course);
    tableEnroll(coursename, instructor, coursedays, coursetime);
});
//==============================================================================
// ================
// Server Functions 
// ================
function addNotification(coursename, instructor, coursedays, coursetime){
    fetch('/addnotification', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            coursename,
            instructor,
            coursedays,
            coursetime
        })
    }).then((res) => console.log("ok"))
    .catch((err) => console.log(err));
}

function removeNotification(coursename, instructor, coursedays, coursetime){
    fetch('/removenotification', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            coursename,
            instructor,
            coursedays,
            coursetime
        })
    }).then((res) => res.json());
}

function tableEnroll(coursename, instructor, coursedays, coursetime){
    var course = coursename+"|"+instructor+"|"+coursedays+"|"+coursetime;
     fetch('/enrollment', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            course
        })
    }).then((res) => res.json());
}