const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const {check} = require('express-validator')
const app = express();

const connectionString = 'process.env.mongodb+srv://qcfirst:qcfirst@qcfirst.psuax.mongodb.net/qcFirst?retryWrites=true&w=majority'
console.log("Server Running");
var port = process.env.PORT || 8080;
MongoClient.connect(connectionString, { useUnifiedTopology: true })

.then(client => {
  console.log('Connected to Database')
  const db = client.db('qcFirst')
  const students = db.collection('students')
  const teachers = db.collection('teachers')
  const classes = db.collection('classes')

  /*db.students.createIndex( { email: 1 }, { unique: true } )
  db.teachers.createIndex( { email: 1 }, { unique: true } ) */
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
    '/studentsignup',
      check('confirmPassword').custom(async (confirmPassword, {req}) => {
        const password = req.body.password
    
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if(password !== confirmPassword){
          throw new Error('Passwords must be same')
        }
      }),
    (req, res) => {
    students.insertOne(req.body)
    .then(result => {
      res.redirect('/')
    })
    .catch(error => console.error(error))
  })

  //When the form on the teacher-signup.html page is submitted, a new entry will be submitted
  //to the teacher table in the MongoDB database
  app.post('/teachersignup', (req, res) => {
    teachers.insertOne(req.body)
    .then(result => {
       res.redirect('/')
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
    res.sendFile(__dirname + "/student-signup.html")
  })

  
})
.catch(console.error)

/* Sources
https://zellwk.com/blog/crud-express-mongodb/
https://stackoverflow.com/questions/18088034/how-to-go-up-using-dirname-in-the-folder-hierarchy
*/
