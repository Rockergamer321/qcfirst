const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const app = express();

const connectionString = 'process.env.mongodb+srv://qcfirst:qcfirst@qcfirst.psuax.mongodb.net/qcFirst?retryWrites=true&w=majority'

console.log("Server Running");

app.listen(3000, function() {
    console.log('listening on 3000')
})

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
        app.use(bodyParser.urlencoded({ extended: true }))

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/sign-up.html')
        })

        app.post('/users', (req, res) => {
            students.insertOne(req.body)
              .then(result => {
                res.redirect('/')
              })
              .catch(error => console.error(error))
        })

})