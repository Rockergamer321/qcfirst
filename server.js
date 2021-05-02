const express = require('express');
const MongoClient = require('mongodb').MongoClient;
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

  // ======================
  // Middlewares
  // ======================

  app.use(express.urlencoded({ extended: true }))
  app.use(express.static('./'));
 
  // ======================
  // Routes
  // ======================

  app.post('/studentsignup', (req, res) => {
    students.insertOne(req.body)
    .then(result => {
      res.redirect('/')
    })
    .catch(error => console.error(error))
  })

  app.post('/teachersignup', (req, res) => {
    teachers.insertOne(req.body)
    .then(result => {
       res.redirect('/')
    })
    .catch(error => console.error(error))
  }) 

  app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
  })

  app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
  });
})
.catch(console.error)

/* Sources
https://zellwk.com/blog/crud-express-mongodb/
https://stackoverflow.com/questions/18088034/how-to-go-up-using-dirname-in-the-folder-hierarchy
*/
