const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema ({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    emailaddress: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student

const TeacherSchema = new Schema ({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    emailaddress: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher