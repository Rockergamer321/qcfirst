/* This is the server.js page that contains the node.js code that allows the user to 
access the mongoDB database and perform CRUD operations on it. It also includes
express-validator methods to add constraints to database entries.  */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//Connect to MongoDB Atlas
try {
  connectionstring = 'mongodb+srv://qcfirst:qcfirst@qcfirst.psuax.mongodb.net/qcFirst?retryWrites=true&w=majority';
  mongoose.connect(
    connectionstring, 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log("Mongoose is connected")
  );
} catch (e) {
  console.log("Failed to connect")
}

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", (err) => console.log(`Connection error ${err}`));
db.once("open", () => console.log("Connected to DB!"));

var app = express();

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Running on Port' + port);
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// ==============
// MIDDLEWARES 
// ==============

app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({
  extended: true
}));

//Login 

//Student Sign Up
var Student = require("./js/model.js");
app.post('/studentsignup', function(req, res) {
  var firstname= req.body.firstname;
  var lastname = req.body.lastname;
  var emailaddress = req.body.emailaddress;
  var password = req.body.password;

  req.body.password = bcrypt.hashSync(req.body.password, 10);

  var data = {
    "firstname": firstname,
    "lastname": lastname,
    "emailaddress": emailaddress,
    "password": password
  }

  let student = new Student(data);
  student.save(function(err, doc) {
    if (err) return console.error(err);
  });
    return res.redirect("https://qcfirst.herokuapp.com/signup-successful.html");
})

//Teacher Sign Up
var Teacher = require("./js/model.js");
app.post('/teachersignup', function(req, res) {

  req.body.password = bcrypt.hashSync(req.body.password, 10);

  var firstname= req.body.firstname;
  var lastname = req.body.lastname;
  var emailaddress = req.body.emailaddress;
  var password = req.body.password;
  
  var data = {
    "firstname": firstname,
    "lastname": lastname,
    "emailaddress": emailaddress,
    "password": password
  }

  let teacher = new Teacher(data);
  teacher.save(function(err, doc) {
    if (err) return console.error(err);
  });
    return res.redirect("https://qcfirst.herokuapp.com/signup-successful.html");
})

//Create A Class handling: incomplete
var Course = require("./js/model.js");
app.post('/createaclass', function(req, res) {
  var semester = req.body.semester;
  var coursename = req.body.coursename;
  var department = req.body.department;
  var instructor = req.body.instructor;
  var schedule = req.body.schedule;
  var enrollmentdeadline = req.body.enrollmentdeadline;
  var capacity = req.body.capacity;
  var description = req.body.description;

  var data = {
    "semester": semester,
    "coursename": coursename,
    "department": department,
    "instructor": instructor,
    "schedule": schedule,
    "enrollmentdeadline": enrollmentdeadline,
    "capacity": capacity,
    "description": description
  }

  let course = new Course(data);
  course.save(function(err, doc) {
    if (err) return console.error(err);
  });
    return res.redirect("https://qcfirst.herokuapp.com/signup-successful.html");
})

/* Sources
https://zellwk.com/blog/crud-express-mongodb/
https://stackoverflow.com/questions/18088034/how-to-go-up-using-dirname-in-the-folder-hierarchy
*/
