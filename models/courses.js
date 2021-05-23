const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema (
	{
		semester: {type: String, required: true},
		coursename: {type: String, required: true},
		department: {type: String, required: true},
		instructor: {type: String, required: true},
		coursedays: {type: String, required: true},
		mobiledays: {type: String, required: true},
		coursetime: {type: String, required: true},
		enrollmentdeadline: {type: Date, required: true},
		capacity: {type: Number, required: true},
		studentsenrolled: {type: Number, required: true},
		studentroster: {type: String},
		description: {type: String, required: true}
	}
);

const Course = mongoose.model('Course', CourseSchema, 'courses');
module.exports = Course;