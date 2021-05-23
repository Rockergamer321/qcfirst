const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema (
	{
		semester: {type: String, required: true},
		coursename: {type: String, required: true},
		department: {type: String, required: true},
		instructor: {type: String, required: true},
		coursedays: {type: String, required: true},
		coursetime: {type: String, required: true},
		description: {type: String, required: true},
        studentname: {type: String, required: true},
		studentroster: {type: String},
        studentemail: {type: String, required: true}
	}
);

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema, 'enrollment');
module.exports = Enrollment;