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
    }
};