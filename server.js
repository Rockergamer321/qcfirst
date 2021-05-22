/* This is the server.js page that contains the node.js code that allows the user to 
access the mongoDB database and perform CRUD operations on it. It also includes
express-validator methods to add constraints to database entries.  */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const { userRedirect, ensureAuthenticated, timeString, idGenerator } = require('./js/user-functions');

//Connect to MongoDB Atlas
try {
  connectionstring = 'mongodb+srv://qcfirst:qcfirst@qcfirst.psuax.mongodb.net/qcFirst?retryWrites=true&w=majority';
  mongoose.connect(
    connectionstring, 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log("Mongoose is connected")
  );
} catch (e) {
  console.log("Failed to connect");
}

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", (err) => console.log(`Connection error ${err}`));
db.once("open", () => console.log("Connected to DB!"));

var app = express();

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Running on Port ' + port);
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
mongoose.set('useFindAndModify', false);

// ==============
// MIDDLEWARES 
// ==============

app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({
  extended: true
}));

// Express session (Required by flash)
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Passport Middlewares (Responsible for Logging Users in)
app.use(passport.initialize());
app.use(passport.session());

//Passport Config:
require('./js/passport-config')(passport);

//Connect flash (Sends Form Messages)
app.use(flash());

//Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//This loads up the Student Signup page
app.get('/studentsignup', (req, res) => {
  res.render('student-signup');
});

//Student Sign Up
var User = require("./models/users.js");
app.post('/studentsignup', function(req, res) {
  var name= req.body.firstname + " " + req.body.lastname;
  var id = idGenerator();
  var role = "Student";
  var email = req.body.email;
  var password = req.body.password;

  let errors = [];

  User.findOne({ "email": email }).then(user => {
    if (user) {
      errors.push({ msg: 'Email already exists' });
      res.render('student-signup', {
        errors
      });
    }
  });

  var data = {
    "name": name,
    "userid": id,
    "role": role,
    "email": email,
    "password": password
  };

  let newStudent = new User(data);

  //Hash Password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newStudent.password, salt, (err, hash) => {
      if(err) throw err;
      newStudent.password = hash; // Set Password to Hash
      newStudent.save().then(User => { 
          req.flash('success_msg', 'You are now registered and can log in');
          res.redirect("/login"); }).catch(err => console.log(err));
    });
  });
});

//This loads up the Teacher Signup page
app.get('/teachersignup', (req, res) => {
  res.render('teacher-signup');
});

//Teacher Sign Up
app.post('/teachersignup', function(req, res) {
  var name = req.body.firstname + " " + req.body.lastname;
  var id = idGenerator();
  var role = "Faculty";
  var email = req.body.email;
  var password = req.body.password;

  let errors = [];

  User.findOne({ "email": email }).then(user => {
    if (user) {
      errors.push({ msg: 'Email already exists' });
      res.render('teacher-signup', {
        errors
      });
    }
  });

  var data = {
    "name": name,
    "userid": id,
    "role": role,
    "email": email,
    "password": password
  };

  let newTeacher = new User(data);

  //Hash Password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newTeacher.password, salt, (err, hash) => {
      if(err) throw err;
      newTeacher.password = hash; // Set Password to Hash
      newTeacher.save().then(User => { 
          req.flash('success_msg', 'You are now registered and can log in');
          res.redirect("/login"); }).catch(err => console.log(err));
    });
  });
});

//This loads up the login page
app.get('/login', (req, res) => {
  res.render('login');
});

//Login
var User = require("./models/users.js");
app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), (req, res) => {
    res.redirect(userRedirect(req.user.role));
 });

//Log out / Sign out User
app.get('/signout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You Are Signed Out');
  res.redirect('/login');
});

//This loads the Admin page
app.get('/admincenter', (req, res) => {
  res.render('admin');
});

//This loads up the Student Center page
app.get('/studentcenter', ensureAuthenticated, (req, res) => {
  res.render('student-center', {
    name: req.user.name,
    tableError: ""
  });
});

app.post("/studentcenter", function(req, res){
  var semester = req.body.semester;
  if(semester == "notified"){
    Notification.find({"studentname": req.user.name}, function(err, allCourses){
      if(err) console.log(err);
      else{
        let today = new Date();
        var tableError;
        if(allCourses.length < 1){
          tableError = "You have no notifications";
        }
        res.render("student-center", {name: req.user.name, courseresults: allCourses, tableError: tableError, semester: semester, todaysDate: today});
      }
    });
  }
  else{
    Enrollment.find({"semester": semester, "studentname": req.user.name}, function(err, allCourses){
      if(err) console.log(err);
      else{
        var tableError;
        if(allCourses.length < 1){
          tableError = "You have not enrolled in any courses this semester";
        }
        res.render("student-center", {name: req.user.name, courseresults: allCourses, tableError: tableError, semester: semester});
      }
    });
  }
});

//This loads up the Course Search page
app.get('/coursesearch', ensureAuthenticated, (req, res) => {
  res.render('course-search', {
    courseError: ""
  });
});

//Get Course Results from Search
app.post('/coursesearch', function(req, res) {
  var courseError = null;
  var course;
  course = req.body.subject + " " + req.body.course;
  Course.find({"coursename": {$regex: course}, "semester": req.body.semester}, function(err, allCourses){
    if(err) console.log(err);
    else{
      if(allCourses.length < 1){
        courseError = "No results were found.\nPlease try again";
      }
      var mobileInstructor = [];
      for(i=0; i<allCourses.length; i++){
        var instructorLast = allCourses[i].instructor;
        instructorLast = instructorLast.split(" ");
        instructorLast = instructorLast[1];
        mobileInstructor[i] = instructorLast;
      }
      res.render("course-search", {courseresults: allCourses, courseError: courseError, courseCount: allCourses.length, mobileInstructor: mobileInstructor});
    }
  });
});

//This loads up the Faculty Center page
app.get('/facultycenter', ensureAuthenticated,(req, res) => {
  res.render('faculty-center', {
    name: req.user.name,
    tableError: ""
  });
});

app.post("/facultycenter", function(req, res){
  var semester = req.body.semester;
  Course.find({"semester": semester, "instructor": req.user.name}, function(err, allCourses){
    if(err) console.log(err);
    else{
      var tableError;
      if(allCourses.length < 1){
        tableError = "You did not create courses for this semester";
      }
      res.render("faculty-center", {name: req.user.name, courseresults: allCourses, tableError: tableError});
    }
  });
});

//This loads up the Create a Course page
app.get('/createacourse', ensureAuthenticated, (req, res) => {
  res.render('createacourse');
});

//Create A Class handling
var Course = require("./models/courses.js");
app.post('/createacourse', function(req, res) {
  var semester = req.body.semester;
  var coursename = req.body.subject + " " + req.body.coursenumber;
  var department = req.body.department;
  var instructor = req.body.instructor;
  var dayArray = req.body.coursedays;
  //Create a string of days that will either be shown on desktop/mobile
  var coursedays;
  var mobiledays;
  //Checks if there are multiple days
  if(Array.isArray(dayArray)){
    for(i=0; i<dayArray.length; i++){
      if(i == 0){
        mobiledays = dayArray[i].substring(0, 2);
        coursedays = dayArray[i];
      }
      else{
        mobiledays += "/" + dayArray[i].substring(0, 2);
        coursedays += ", " + dayArray[i];
      }
    }
  }
  //If not, place single day here
  else{
    mobiledays = dayArray.substring(0, 2);
    coursedays = dayArray;
  }
  var coursetime = timeString(req.body.coursestart) + " - " + timeString(req.body.courseend);
  var enrollmentdeadline = req.body.enrollmentdeadline;
  var capacity = req.body.capacity;
  var studentsenrolled = 0;
  var description = req.body.description;

  var data = {
    "semester": semester,
    "coursename": coursename,
    "department": department,
    "instructor": instructor,
    "coursedays": coursedays,
    "mobiledays": mobiledays,
    "coursetime": coursetime,
    "enrollmentdeadline": enrollmentdeadline,
    "capacity": capacity,
    "studentsenrolled": studentsenrolled,
    "description": description
  };

  let course = Course(data);

  course.save().then(Course => { 
          req.flash('success_msg', 'Course Created Successfully');
          res.redirect("/createacourse"); }).catch(err => console.log(err));
});

//This Loads up the Settings Page
app.get('/settings', ensureAuthenticated,(req, res) => {
  res.render('settings', {
    home: userRedirect(req.user.role),
    name: req.user.name,
    email: req.user.email,
    userid: req.user.userid
  });
});

app.post("/settings", function(req, res){
  var newEmail = req.body.email;
  User.findOneAndUpdate({"email": req.user.email}, {$set: {"email": newEmail}}, {new: true}, (err, user) => {
    if(err) console.log("Email did not update properly");
    console.log(user);
  });
  res.redirect("/settings");
});

//Handles Course Enrollment
var Enrollment = require("./models/enrollment.js");
app.post('/enrollment', function(req, res) {
  var course = req.body.course;
  course = course.split("|");
  var coursename = course[0];
  var instructor = course[1];
  var coursedays = course[2];
  var coursetime = course[3];

  Course.find({"coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, function(err, allCourses){
    if(err) console.log(err);
    else{
      var semester = allCourses[0].semester;
      var coursename = allCourses[0].coursename;
      var department = allCourses[0].department;
      var instructor = allCourses[0].instructor;
      var coursedays = allCourses[0].coursedays;
      var coursetime = allCourses[0].coursetime;
      var description = allCourses[0].description;
      var name = req.user.name;
      var email = req.user.email;

      let courseError;
      //Checks if Student is already enrolled in the selected course
      Enrollment.findOne({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": name, "studentemail": email}).then(enroll => {
        if (enroll) {
          courseError = "You are already enrolled in that course";
          res.render('course-search', {
            courseError
          });
        }
        else{
          //Increases Students enrolled by 1
          Course.findOneAndUpdate({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$inc: {"studentsenrolled": 1}}, {new: true}, function(err, response){
            if(err) console.log(err);
            console.log(response);
          });

          var data = {
            "semester": semester,
            "coursename": coursename,
            "department": department,
            "instructor": instructor,
            "coursedays": coursedays,
            "coursetime": coursetime,
            "description": description,
            "studentname": name,
            "studentemail": email
          };
          let enrollment = Enrollment(data);
          enrollment.save().then(Enrollment => { 
              courseError = "Enrolled Successfully";
              res.render("course-search", {courseError: courseError}); }).catch(err => console.log(err));
        }
      });
    }
  });
});

//When Notification Button is Clicked, Course is added to Notification Table
var Notification = require("./models/notifications.js");
app.post('/addnotification', function(req, res) {
  var coursename = req.body.coursename;
  var instructor = req.body.instructor;
  var coursedays = req.body.coursedays;
  var coursetime = req.body.coursetime;

  Course.find({"coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, function(err, allCourses){
    if(err) console.log(err);
    else{
      var semester = allCourses[0].semester;
      var coursename = allCourses[0].coursename;
      var department = allCourses[0].department;
      var instructor = allCourses[0].instructor;
      var coursedays = allCourses[0].coursedays;
      var coursetime = allCourses[0].coursetime;
      var description = allCourses[0].description;
      var capacity = allCourses[0].capacity;
      var studentsenrolled = allCourses[0].studentsenrolled;
      var enrollmentdeadline = allCourses[0].enrollmentdeadline;
      var name = req.user.name;
      var email = req.user.email;
      
      let courseError;
      //Checks if Student is already notified for that course
      Notification.findOne({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": name, "studentemail": email}).then(enroll => {
        if (enroll) {
          courseError = "You are already notified for that course";
          console.log("You are already notified for that course");
          res.render('course-search', {
            courseError: courseError
          });
        }
        else{
          var data = {
            "semester": semester,
            "coursename": coursename,
            "department": department,
            "instructor": instructor,
            "coursedays": coursedays,
            "coursetime": coursetime,
            "description": description,
            "capacity": capacity,
            "studentsenrolled": studentsenrolled,
            "enrollmentdeadline": enrollmentdeadline,
            "studentname": name,
            "studentemail": email
          };
          let notification = Notification(data);
          notification.save().then(notified => { 
              req.flash('success_msg', 'We\'ll Remind You\'');
              res.redirect("/coursesearch"); }).catch(err => console.log(err));
        }
      });
    }
  });
});

//When Notification Button is Clicked, Course is added to Notification Table
app.post('/removenotification', function(req, res) {
  var coursename = req.body.coursename;
  var instructor = req.body.instructor;
  var coursedays = req.body.coursedays;
  var coursetime = req.body.coursetime;
  Notification.findOneAndRemove({"coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": req.user.name, "studentemail": req.user.email}, function(err, allCourses){
    if(err) console.log(err);
    console.log("Course Removed Successfully");
  });
});

/* Sources
https://zellwk.com/blog/crud-express-mongodb/
https://stackoverflow.com/questions/18088034/how-to-go-up-using-dirname-in-the-folder-hierarchy
*/