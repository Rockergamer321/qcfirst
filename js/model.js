const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema ({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    emailaddress: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;

const TeacherSchema = new Schema ({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    emailaddress: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;

const CourseSchema = new Schema ({
    semester: {type: String, required: true},
    coursename: {type: String, required: true},
    department: {type: String, required: true},
    instructor: {type: String, required: true},
    description: {type: String, required: true},
    schedule: {type: String, required: true},
    capacity: {type: Number, required: true},
    enrollmentdeadline: {type: Date, required: true}
})

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;