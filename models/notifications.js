const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema (
	{
		semester: {type: String, required: true},
		coursename: {type: String, required: true},
		department: {type: String, required: true},
		instructor: {type: String, required: true},
		coursedays: {type: String, required: true},
		coursetime: {type: String, required: true},
		description: {type: String, required: true},
		capacity: {type: Number, required: true},
		studentsenrolled: {type: Number, required: true},
		enrollmentdeadline: {type: Date, required: true},
        studentname: {type: String, required: true},
        studentemail: {type: String, required: true}
	}
);

const Course = mongoose.model('Notification', NotificationSchema, 'notifications');
module.exports = Course;