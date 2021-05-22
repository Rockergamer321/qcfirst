const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema (
	{
		name: {type: String, required: true},
		userid: {type: String, required: true},
		role: {type: String, required: true},
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
	}
);

const User = mongoose.model('User', UserSchema, 'users');
module.exports = User;