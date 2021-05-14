//Function to convert time input to string
function timeString(time) { //https://www.youtube.com/watch?v=2kkTB702yp8
    if(time.value !== "") {
        var hours = time.split(":")[0];
        var minutes = time.split(":")[1];
        var suffix = hours >= 12 ? "PM": "AM";
        hours = hours % 12 || 12;
        hours = hours < 10 ? "0" + hours : hours;

        var timeString = hours + ":" + minutes + " " + suffix;
        return timeString;
    }
}

const form = document.getElementById("createacourse");
form.addEventListener("submit", createCourse);

async function createCourse(event) {
    //Gets the dropdown value (https://stackoverflow.com/questions/5069294/get-inner-html-of-the-selected-option/5069331)
    var semester = document.getElementById("semester-dropdown");
    semester = semester.options[semester.selectedIndex].text;
    const coursename = document.getElementById("coursename").value;
    const department = document.getElementById("department").value;
    const instructor = document.getElementById("instructor").value;
    
    //Converts checkbox values to string (https://stackoverflow.com/questions/11292778/use-jquery-to-get-values-of-selected-checkboxes)
    var checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
    var coursedays = "";
    for(var i=0; i<checkboxes.length; i++){
        if(coursedays != ""){
            coursedays += ", " + checkboxes[i].value;
        }
        else coursedays = checkboxes[i].value; 
    }
    
    //Convert Time inputs into a single string
    var coursestart = timeString(document.getElementById("coursestart").value);
    var courseend = timeString(document.getElementById("courseend").value);
    var coursetime = coursestart + " - " + courseend;

    const enrollmentdeadline = document.getElementById("enrollmentdeadline").value;
    const capacity = document.getElementById("capacity").value;
    var studentsenrolled = 0; //This will be updated when students enroll in class
    const description = document.getElementById("description").value;

    const result = await fetch('/createacourse', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            semester,
            coursename,
            department,
            instructor,
            coursedays,
            coursetime,
            enrollmentdeadline,
            capacity,
            studentsenrolled,
            description
        })
    }).then((res) => res.json());
}