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
const { ensureAuthenticated } = require('./js/authorize');
const { userRedirect } = require('./js/user-redirect');

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

//This loads up the login page
app.get('/login', (req, res) => {
  res.render('login');
});

//This loads up the Student Signup page
app.get('/studentsignup', (req, res) => {
  res.render('student-signup');
});
//This loads up the Teacher Signup page
app.get('/teachersignup', (req, res) => {
  res.render('teacher-signup');
});

//This loads up the Student Center page
app.get('/studentcenter', ensureAuthenticated, (req, res) => {
  res.render('student-center', {
    name: req.user.firstname + " " + req.user.lastname
  });
});

//This loads up the Course Search page
app.get('/coursesearch', ensureAuthenticated, (req, res) => {
  res.render('course-search');
});

//This loads up the Faculty Center page
app.get('/facultycenter', ensureAuthenticated,(req, res) => {
  res.render('faculty-center', {
    name: req.user.firstname + " " + req.user.lastname
  });
});

//This loads up the Create a Course page
app.get('/createacourse', ensureAuthenticated, (req, res) => {
  res.render('createacourse');
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

app.get('user-display', (req, res) => {
  res.render('user-display');
});

app.get('/course-display', (req, res) => {
  res.render('course-display');
});
//This Loads up the Settings Page
app.get('/settings', ensureAuthenticated,(req, res) => {
  res.render('settings', {
    home: userRedirect(req.user.role),
    name: req.user.firstname + " " + req.user.lastname,
    email: req.user.emailaddress
  });
});

//Student Sign Up
var User = require("./models/users.js");
app.post('/studentsignup', function(req, res) {
  var firstname= req.body.firstname;
  var lastname = req.body.lastname;
  var role = "Student";
  var emailaddress = req.body.emailaddress;
  var password = req.body.password;

  let errors = [];

  User.findOne({ emailaddress: emailaddress }).then(user => {
    if (user) {
      errors.push({ msg: 'Email already exists' });
      res.render('student-signup', {
        errors
      });
    }
  });

  var data = {
    "firstname": firstname,
    "lastname": lastname,
    "role": role,
    "emailaddress": emailaddress,
    "password": password
  };

  let newStudent = new User(data);

  //Hash Password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newStudent.password, salt, (err, hash) => {
      if(err) throw err;
      newStudent.password = hash; // Set Password to Hash
      newStudent.save()
        .then(User => { 
          req.flash('success_msg', 'You are now registered and can log in');
          res.redirect("/login"); })
        .catch(err => console.log(err));
    });
  });
});

//Teacher Sign Up
var User = require("./models/users.js");
app.post('/teachersignup', function(req, res) {
  var firstname= req.body.firstname;
  var lastname = req.body.lastname;
  var role = "Faculty";
  var emailaddress = req.body.emailaddress;
  var password = req.body.password;

  let errors = [];

  User.findOne({ emailaddress: emailaddress }).then(user => {
    if (user) {
      errors.push({ msg: 'Email already exists' });
      res.render('teacher-signup', {
        errors
      });
    }
  });

  var data = {
    "firstname": firstname,
    "lastname": lastname,
    "role": role,
    "emailaddress": emailaddress,
    "password": password
  };

  let newTeacher = new User(data);

  //Hash Password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newTeacher.password, salt, (err, hash) => {
      if(err) throw err;
      newTeacher.password = hash; // Set Password to Hash
      newTeacher.save()
        .then(User => { 
          req.flash('success_msg', 'You are now registered and can log in');
          res.redirect("/login"); })
        .catch(err => console.log(err));
    });
  });
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

//Create A Class handling
var Course = require("./models/courses.js");
app.post('/createacourse', function(req, res) {
  var semester = req.body.semester;
  var coursename = req.body.coursename;
  var department = req.body.department;
  var instructor = req.body.instructor;
  var coursedays = req.body.coursedays;
  var coursetime = req.body.coursetime;
  var enrollmentdeadline = req.body.enrollmentdeadline;
  var capacity = req.body.capacity;
  var studentsenrolled = req.body.studentsenrolled;
  var description = req.body.description;

  var data = {
    "semester": semester,
    "coursename": coursename,
    "department": department,
    "instructor": instructor,
    "coursedays": coursedays,
    "coursetime": coursetime,
    "enrollmentdeadline": enrollmentdeadline,
    "capacity": capacity,
    "studentsenrolled": studentsenrolled,
    "description": description
  };

  let course = Course(data);
  course.save()
        .then(User => { 
          req.flash('success_msg', 'Success');
          res.redirect("/createacourse"); })
        .catch(err => console.log(err));
        res.redirect("/createacourse");
  });

  
/* Sources
https://zellwk.com/blog/crud-express-mongodb/
https://stackoverflow.com/questions/18088034/how-to-go-up-using-dirname-in-the-folder-hierarchy
*/