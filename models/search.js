const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SearchSchema = new Schema (
	{
		name: {type: String},
		email: {type: String},
		searchedsubject: {type: String},
		searchedsemester: {type: String, required: true},
		created_at: {type: Date, default: Date.now},
	}
);

SearchSchema.pre('save', function(next) {
	now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

const Search = mongoose.model('Search', SearchSchema, 'searchResult');
module.exports = Search;