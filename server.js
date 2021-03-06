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
const fs = require('fs');
const { userRedirect, ensureAuthenticated, timeString, idGenerator, timeConflict } = require('./js/user-functions');

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

//File Middleware (Multer) - Stores Uploaded Files
var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
 
var upload = multer({ storage: storage });

//This loads up the Student Signup page
app.get('/studentsignup', (req, res) => {
  res.render('student-signup');
});

//Student Sign Up
var User = require("./models/users.js");
app.post('/studentsignup', upload.single('image'), function(req, res) {
  var name = req.body.firstname + " " + req.body.lastname;
  var id = idGenerator();
  var role = "Student";
  var email = req.body.email;
  var password = req.body.password;
  var image;
  if(req.file != undefined){
    if(req.file.mimetype == 'image/png'){
      image = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
      };
    }
    else{
      image = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/jpeg'
      };
    }
  }
  var notifyemail = false;

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
      "password": password,
      "avatar": image,
      "notifyemail": notifyemail
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
app.post('/teachersignup', upload.single('image'), function(req, res) {
  var name = req.body.firstname + " " + req.body.lastname;
  var id = idGenerator();
  var role = "Faculty";
  var email = req.body.email;
  var password = req.body.password;
  var image;
  if(req.file != undefined){
    if(req.file.mimetype == 'image/png'){
      image = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
      };
    }
    else{
      image = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/jpeg'
      };
    }
  }
  
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
      "password": password,
      "avatar": image
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

// =================
//    Admin Handling
//==================
//This loads the Admin page
app.get('/admincenter', ensureAuthenticated, (req, res) => {
  res.render('admin');
});

//This loads the User Database page
app.get("/userdisplay", ensureAuthenticated, function (req, res) {
  User.find({}, function (err, allUsers) {
    if (err) {
      console.log(err);
    } else {
      res.render("user-display", { allusers: allUsers });
    }
  });
});

//This loads the Course Database page
app.get("/coursedisplay", ensureAuthenticated, function (req, res) {
  Course.find({}, function (err, allCourses) {
    if (err) {
      console.log(err);
    } else {
      res.render("course-display", { allcourses: allCourses });
    }
  });
});


//This loads the search history page
app.get("/searchhistory", ensureAuthenticated, function (req, res) {
  Search.find({}, function (err, searchResult) {
    if (err){
      console.log(err);
    } else {
      res.render("searchhistory", { searchResult: searchResult });
    }
  });
});

//This loads up the Student Center page
app.get('/studentcenter', ensureAuthenticated, (req, res) => {
  res.render('student-center', {
    name: req.user.name,
    avatar: req.user.avatar,
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
        res.render("student-center", {name: req.user.name, courseresults: allCourses, tableError: tableError, avatar: req.user.avatar, semester: semester, todaysDate: today});
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
        res.render("student-center", {name: req.user.name, courseresults: allCourses, tableError: tableError, avatar: req.user.avatar, semester: semester});
      }
    });
  }
});

//This loads up the Course Search page
app.get('/coursesearch', ensureAuthenticated, (req, res) => {
  res.render('course-search', {
    courseError: "",
    avatar: req.user.avatar
  });
});

//Get Course Results from Search
var Search = require("./models/search.js");
app.post('/coursesearch', function(req, res) {
  var courseError = null;
  var course = req.body.subject + " " + req.body.course;
  Course.find({"coursename": {$regex: course}, "semester": req.body.semester}, function(err, allCourses){
    if(err) console.log(err);
    if(allCourses.length < 1){
      courseError = "No results were found.\nPlease try again";
    }
    //This gets today's date and will soon be compared with Enrollment Deadline
    let today = new Date();
    //Gets last name of Instructor (This will be shown on Mobile Devices)
    var mobileInstructor = [];
    for(i=0; i<allCourses.length; i++){
      var instructorLast = allCourses[i].instructor;
      instructorLast = instructorLast.split(" ");
      instructorLast = instructorLast[1];
      mobileInstructor[i] = instructorLast;
    }

    res.render("course-search", {courseresults: allCourses, courseError: courseError, avatar: req.user.avatar, courseCount: allCourses.length, mobileInstructor: mobileInstructor, todaysDate: today});
  });

    var name = req.user.name;
    var email = req.user.email;
    var searchedsubject = course;
    var searchedsemester = req.body.semester;

    var data = {
      "name": name,
      "email": email,
      "searchedsubject": searchedsubject,
      "searchedsemester": searchedsemester
    };
  
    let searchResult = new Search(data);
    searchResult.save().then().catch(err => console.log(err));
});

//This loads up the Faculty Center page
app.get('/facultycenter', ensureAuthenticated,(req, res) => {
  res.render('faculty-center', {
    name: req.user.name,
    tableError: "",
    avatar: req.user.avatar
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
      res.render("faculty-center", {name: req.user.name, courseresults: allCourses, avatar: req.user.avatar, tableError: tableError});
    }
  });
});

app.post("/dropfacultycourse", function(req, res){
  var course = req.body.course;
  course = course.split("|");
  var coursename = course[0];
  var instructor = course[1];
  var coursedays = course[2];
  var coursetime = course[3];
  var semester = course[4];
  
  //Course is removed from Courses table
  Course.findOneAndRemove({"coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "semester": semester}, function(err, allCourses){
    if(err) console.log(err);
    console.log("Course Removed Successfully");
  });
  //This drops every student enrolled in the course
  Enrollment.remove({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, function(err, allCourses){
    if(err) console.log(err);
    console.log("Drops Every Student Enrolled in Course");
  });
  //This drops every student that is notified for the course
  Notification.remove({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, function(err, allCourses){
    if(err) console.log(err);
    console.log("Drops Every Student who is Notified");
  });
  res.render("faculty-center", {name: req.user.name, avatar: req.user.avatar, tableError: "Removed Course Successfully"});
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
  var studentroster = "";
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
    "studentroster": studentroster,
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
    userid: req.user.userid,
    role: req.user.role,
    avatar: req.user.avatar
  });
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
  var semester = course[4];

  Course.find({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, function(err, allCourses){
    if(err) console.log(err);
    else{
      var semester = allCourses[0].semester;
      var coursename = allCourses[0].coursename;
      var department = allCourses[0].department;
      var instructor = allCourses[0].instructor;
      var coursedays = allCourses[0].coursedays;
      var coursetime = allCourses[0].coursetime;
      var description = allCourses[0].description;
      var studentroster = allCourses[0].studentroster;
      if(studentroster == ""){ studentroster = req.user.name + " (" + req.user.email + ")"; }
      else{ studentroster += ", " + req.user.name + " (" + req.user.email + ")"; }
      var name = req.user.name;
      var email = req.user.email;

      let courseError;
      //Checks if Student is already enrolled in the selected course
      Enrollment.findOne({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": name, "studentemail": email}).then(enroll => {
        if (enroll) {
          courseError = "You are already enrolled in that course";
          res.render('course-search', {
            courseError,
            avatar: req.user.avatar
          });
        }
        else{
          Enrollment.findOne({"semester": semester, "coursename": coursename, "studentname": name, "studentemail": email}, function(err, course){
            if(err) console.log(err);
            if(course != null){
              courseError = "You are already enrolled in a " + coursename + " course";
              res.render('course-search', {
                courseError,
                avatar: req.user.avatar
              });
            }
            else{
              var daysRegex = coursedays.replace(/, /, "|");
              Enrollment.find({"semester": semester, "coursedays": {$regex: daysRegex}, "studentname": name, "studentemail": email}, function(err, courses){
                if(err) console.log(err);
                var conflict = false;
                for(i=0; i<courses.length; i++){
                  if(timeConflict(coursetime, courses[i].coursetime) && conflict == false){
                    conflict = true;
                  }
                }
                if(conflict){
                  courseError = "This course conflicts with an enrolled course";
                  res.render('course-search', {
                      courseError,
                      avatar: req.user.avatar
                  });
                }
                else{
                  //Increases Students enrolled by 1
                   Course.findOneAndUpdate({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$inc: {"studentsenrolled": 1}}, {new: true}, function(err, response){
                    if(err) console.log(err);
                  });
                  //Update Student Roster in Courses Table
                  Course.findOneAndUpdate({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$set: {"studentroster": studentroster}}, {new: true}, function(err, response){
                    if(err) console.log(err);
                  });
                  //Update Student Roster in Enrollment Table
                  Enrollment.updateMany({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$set: {"studentroster": studentroster}}, {new: true}, function(err, response){
                    if(err) console.log(err);
                  });
                  var data = {
                    "semester": semester,
                    "coursename": coursename,
                    "department": department,
                    "instructor": instructor,
                    "coursedays": coursedays,
                    "coursetime": coursetime,
                    "description": description,
                    "studentroster": studentroster,
                    "studentname": name,
                    "studentemail": email
                  };
                  let enrollment = Enrollment(data);
                  enrollment.save().then(Enrollment => { 
                    courseError = "Enrolled Successfully";
                    res.render("course-search", {courseError: courseError, avatar: req.user.avatar}); 
                  }).catch(err => console.log(err));
                }
              });
            }
          });
        }
      });
    }
  });
});

app.post('/notifiedenrollment', function(req, res) {
  var course = req.body.course;
  course = course.split("|");
  var coursename = course[0];
  var instructor = course[1];
  var coursedays = course[2];
  var coursetime = course[3];
  var semester = course[4];

  Course.find({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, function(err, allCourses){
    if(err) console.log(err);
    else{
      var semester = allCourses[0].semester;
      var coursename = allCourses[0].coursename;
      var department = allCourses[0].department;
      var instructor = allCourses[0].instructor;
      var coursedays = allCourses[0].coursedays;
      var coursetime = allCourses[0].coursetime;
      var description = allCourses[0].description;
      var studentroster = allCourses[0].studentroster;
      if(studentroster == ""){ studentroster = req.user.name + " (" + req.user.email + ")"; }
      else{ studentroster += ", " + req.user.name + " (" + req.user.email + ")"; }
      var name = req.user.name;
      var email = req.user.email;

      let tableError;
      //Checks if Student is already enrolled in the selected course
      Enrollment.findOne({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": name, "studentemail": email}).then(enroll => {
        if (enroll) {
          tableError = "You are already enrolled in that course";
          res.render('student-center', {
            tableError: tableError,
            name: req.user.name,
            avatar: req.user.avatar
          });
        }
        else{
          Enrollment.findOne({"semester": semester, "coursename": coursename, "studentname": name, "studentemail": email}, function(err, course){
            if(err) console.log(err);
            if(course != null){
              tableError = "You are already enrolled in that type of course";
              res.render('student-center', {
                tableError: tableError,
                name: req.user.name,
                avatar: req.user.avatar
              });
            }
            else{
              var daysRegex = coursedays.replace(/, /, "|");
              Enrollment.find({"semester": semester, "coursedays": {$regex: daysRegex}, "studentname": name, "studentemail": email}, function(err, courses){
                if(err) console.log(err);
                var conflict = false;
                for(i=0; i<courses.length; i++){
                  if(timeConflict(coursetime, courses[i].coursetime) && conflict == false){
                    conflict = true;
                  }
                }
                if(conflict){
                  tableError = "This course conflicts with an enrolled course";
                  res.render('student-center', {
                      tableError: tableError,
                      name: req.user.name,
                      avatar: req.user.avatar
                  });
                }
                else{
                  //Increases Students enrolled by 1
                   Course.findOneAndUpdate({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$inc: {"studentsenrolled": 1}}, {new: true}, function(err, response){
                    if(err) console.log(err);
                  });
                  //Update Student Roster in Courses Table
                  Course.findOneAndUpdate({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$set: {"studentroster": studentroster}}, {new: true}, function(err, response){
                    if(err) console.log(err);
                  });
                  //Update Student Roster in Enrollment Table
                  Enrollment.updateMany({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$set: {"studentroster": studentroster}}, {new: true}, function(err, response){
                    if(err) console.log(err);
                  });
                  Notification.findOneAndRemove({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": name, "studentemail": email}, function(err, res){
                    if(err) console.log(err);
                  });
                  var data = {
                    "semester": semester,
                    "coursename": coursename,
                    "department": department,
                    "instructor": instructor,
                    "coursedays": coursedays,
                    "coursetime": coursetime,
                    "description": description,
                    "studentroster": studentroster,
                    "studentname": name,
                    "studentemail": email
                  };
                  let enrollment = Enrollment(data);
                  enrollment.save().then(Enrollment => { 
                    tableError = "Enrolled Successfully";
                    res.render("student-center", {tableError: tableError, avatar: req.user.avatar, name: req.user.name}); 
                  }).catch(err => console.log(err));
                }
              });
            }
          });
        }
      });
    }
  });
});

app.post('/dropcourse', function(req, res) {
  var course = req.body.course;
  course = course.split("|");
  var coursename = course[0];
  var instructor = course[1];
  var coursedays = course[2];
  var coursetime = course[3];
  var semester = course[4];
  var studentroster = course[5];
  studentroster = studentroster.split(", ");
  if(studentroster.length == 1){
    studentroster = "";
  }
  else{
    var target = req.user.name + " (" + req.user.email + ")";
    var index = studentroster.indexOf(target);
    if(index > -1){
      studentroster.splice(index, 1);
    }
    if(studentroster.length == 1) studentroster = studentroster[0];
    else studentroster.join(", ");
  }
  Course.findOneAndUpdate({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$set: {"studentroster": studentroster}, $inc: {"studentsenrolled": -1}}, {new: true}, function(err, response){
    if(err) console.log(err);
  });
  //Update Student Roster in Enrollment Table
  Enrollment.updateMany({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, {$set: {"studentroster": studentroster}}, {new: true}, function(err, response){
    if(err) console.log(err);
  });
  //Remove course from enrollment table
  Enrollment.findOneAndRemove({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": req.user.name, "studentemail": req.user.email}, function(err, allCourses){
    if(err) console.log(err);
      console.log("Course Removed Successfully");
      res.render("student-center", {name: req.user.name, avatar: req.user.avatar, tableError: "Removed Enrolled Course Successfully"});
    });
});

//When Notification Button is Clicked, Course is added to Notification Table
var Notification = require("./models/notifications.js");
app.post('/addnotification', function(req, res) {
  var course = req.body.course;
  course = course.split("|");
  var coursename = course[0];
  var instructor = course[1];
  var coursedays = course[2];
  var coursetime = course[3];
  var semester = course[4];

  Course.find({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime}, function(err, allCourses){
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
          if(enroll != undefined){
          courseError = "You are already notified for that course";
          console.log("You are already notified for that course");
          res.render('course-search', {
            courseError: courseError,
            avatar: req.user.avatar
          });
        }
        else{
          Enrollment.findOne({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": name, "studentemail": email}).then(enroll => {
              if(enroll != undefined){
                courseError = "Why do you want notifications in a course you're enrolled in?";
                res.render('course-search', {
                  courseError: courseError,
                  avatar: req.user.avatar
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
                  courseError = "We\'ll\ Remind You";
                  res.render("course-search", {avatar: req.user.avatar, courseError: courseError});
                }).catch(err => console.log(err));
              }
            });
        }
      });
    }
  });
});

//When Notification Button is Clicked, Course is added to Notification Table
app.post('/removenotification', function(req, res) {
  var course = req.body.course;
  course = course.split("|");
  var coursename = course[0];
  var instructor = course[1];
  var coursedays = course[2];
  var coursetime = course[3];
  var semester = course[4];

  Notification.findOneAndRemove({"semester": semester, "coursename": coursename, "instructor": instructor, "coursedays": coursedays, "coursetime": coursetime, "studentname": req.user.name, "studentemail": req.user.email}, function(err, allCourses){
    if(err) console.log(err);
    console.log("Course Removed Successfully");
  });
  res.render("student-center", {name: req.user.name, avatar: req.user.avatar, tableError: "Removed Notified Course Successfully"});
});

/* Sources
Jonathan M Dinh:
https://zellwk.com/blog/crud-express-mongodb/
https://stackoverflow.com/questions/18088034/how-to-go-up-using-dirname-in-the-folder-hierarchy

Anthony Lombardo:
https://www.stackoverflow.com/
https://www.w3schools.com/
For User Registration - https://www.youtube.com/watch?v=6FOq4cUdH8k
For Image Upload - https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
*/