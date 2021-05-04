/* This is the server.js page that contains the node.js code that allows the user to 
access the mongoDB database and perform CRUD operations on it. It also includes
express-validator methods to add constraints to database entries.  */

const express = require('express');
const mongoose = require('mongoose');

//Connect to MongoDB Atlas
try {
  connectionstring = 'mongodb+srv://qcfirst:qcfirst@qcfirst.psuax.mongodb.net/qcFirst?retryWrites=true&w=majority';
  mongoose.connect(
    connectionstring, 
    { useNewUrlParser: true, useUnifiedTopology: true },
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

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/teacher-signup.html");
});

app.use(express.json());
app.use(express.static('./'));
app.use(express.urlencoded({
  extended: true
}));

var Student = require("./model.js");
app.post('/studentsignup', function(req, res) {
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

  let student = new Student(data);
  student.save(function(err, doc) {
    if (err) return console.error(err);
  });
    return res.redirect("https://qcfirst.herokuapp.com/signup-successful.html");
})

var Teacher = require("./model.js");
app.post('/teachersignup', function(req, res) {
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

  db.collection('teachers').insertOne(data, function(err, collection) {
    if(err) throw err;
    console.log("Course Successfully Created!");
  });
  
  return res.redirect("https://qcfirst.herokuapp.com/createaclass.html");
})

//ATTEMPT #1 WITHOUT USING MONGOOSE
//const MongoClient = require('mongodb').MongoClient;
/*console.log("Server Running");
var port = process.env.PORT || 8080;
MongoClient.connect(connectionString, { useUnifiedTopology: true })

.then(client => {
  console.log('Connected to Database')
  const db = client.db('qcFirst')
  const students = db.collection('students')
  const teachers = db.collection('teachers')
  const classes = db.collection('classes')


  // ======================
  // Middlewares
  // ======================

  app.use(express.urlencoded({ extended: true }))
  app.use(express.static('./'));
 
  // ======================
  // Routes
  // ======================

  //When the form on the student-signup.html page is submitted, a new entry will be submitted
  //to the student table in the MongoDB database
  app.listen(port, function() {
    console.log('Running on Port' + port);
  });

  app.post(
    '/studentsignup',(req, res) => {
      students.insertOne(req.body)
      .then(result => {
      res.redirect("https://qcfirst.herokuapp.com/login.html")
    })
      .catch(error => console.error(error))
  })

  //When the form on the teacher-signup.html page is submitted, a new entry will be submitted
  //to the teacher table in the MongoDB database
  app.post('/teachersignup', (req, res) => {
    teachers.insertOne(req.body)
    .then(result => {
       res.redirect('"https://qcfirst.herokuapp.com/login.html"')
    })
    .catch(error => console.error(error))
  }) 

  //When the form on the createaclass.html page is submitted, a new entry will be submitted
  //to the classes table in the MongoDB database
  app.post('/createaclass', (req, res) => {
    classes.insertOne(req.body)
    .then(result => {
       res.redirect('/')
    })
    .catch(error => console.error(error))
  }) 

  app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
  })

  
})
.catch(console.error)
*/

/* Sources
https://zellwk.com/blog/crud-express-mongodb/
https://stackoverflow.com/questions/18088034/how-to-go-up-using-dirname-in-the-folder-hierarchy
*/
