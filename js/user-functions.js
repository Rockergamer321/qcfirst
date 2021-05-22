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
    }
};