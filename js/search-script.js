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
    var valueArray = this.value.split("|");
    var availableseats = valueArray[5];
    var enrollmentdeadline = Date.parse(valueArray[6]);
    var todaysDate = new Date();

    if(availableseats == 0){
        document.getElementById("availability").innerHTML = "<h3>Availability Status: </h3> <img class=\"availability-icon\" src=\"img/Red_Circle.png\" height=40 width=40 alt=\"This Class is Currently Unavailable\"/>";
    }
    else{
        document.getElementById("availability").innerHTML = "<h3>Availability Status: </h3> <img class=\"availability-icon\" src=\"img/Green_Circle.png\" height=40 width=40 alt=\"This Class is Currently Available\"/>";
    }
    if(availableseats > 0 && todaysDate < enrollmentdeadline){
        document.getElementById("check-submit").innerHTML = "<input type=\"submit\" value=\"Enroll\">";
    }
    else{
        document.getElementById("check-submit").innerHTML = "";
    }
});