module.exports = {
    userRedirect: function(role){
        switch(role){
            case 'Admin':
                return '/admincenter';
            case 'Student':
                return '/studentcenter';
            case 'Faculty':
                return '/facultycenter';
            default:
                return '/';
        }
    },
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please Log In to View This Page');
        res.redirect('/login');
    },
    //Function to convert time input to string
    timeString: function (time) { //https://www.youtube.com/watch?v=2kkTB702yp8
        if(time.value !== "") {
            var hours = time.split(":")[0];
            var minutes = time.split(":")[1];
            var suffix = hours >= 12 ? "PM": "AM";
            hours = hours % 12 || 12;
            hours = hours < 10 ? "0" + hours : hours;

            var timeString = hours + ":" + minutes + " " + suffix;
            return timeString;
        }
    },
    idGenerator: function(){
        return 20000000 + Math.floor(Math.random() * 10000001);
    },
    timeConflict: function(time1, time2){
        time1 = convertTime(time1);
        time2 = convertTime(time2);
        if ( (time1[0][0] >= time2[0][0] && time1[0][1] >= time2[0][1] && time1[0][2] >= time2[0][2] && time1[1][0] >= time2[0][0] && time1[1][1] >= time2[0][1] && time1[1][2] >= time2[0][2]) || (time1[0][0] <= time2[0][0] && time1[0][1] <= time2[0][1] && time1[0][2] <= time2[0][2] && time1[1][0] <= time2[1][0] && time1[1][1] <= time2[1][1] && time1[1][2] <= time2[1][2]) || (time1[0][0] <= time2[0][0] && time1[0][1] <= time2[0][1] && time1[0][2] <= time2[0][2] && time1[1][0] >= time2[1][0] && time1[1][1] >= time2[1][1] && time1[1][2] >= time2[1][2]) || (time1[0][0] >= time2[0][0] && time1[0][1] >= time2[0][1] && time1[0][2] >= time2[0][2] && time1[1][0] <= time2[1][0] && time1[1][1] <= time2[1][1] && time1[1][2] <= time2[1][2]) ) {
            return true;
        }
        else{
            return false;
        }

        function convertTime (time){
            time = time.replace(/ AM/g, ":AM");  
            time = time.replace(/ PM/g, ":PM");
            var timeArray = time.split(" - ");
            for(i = 0; i < timeArray.length; i++) {
              timeArray[i] = timeArray[i].split(":");
            }
            return timeArray;
        }
    },
};

/*
* For Time Conflict: 
* https://codereview.stackexchange.com/questions/240011/js-schedule-conflict-detection-algorithm-logic-length
* https://stackoverflow.com/questions/35009779/check-time-conflict-on-javascript
*/