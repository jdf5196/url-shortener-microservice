const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
	originalUrl: String,
	newUrl: String,
	random: String
});

mongoose.model('Url', UrlSchema);