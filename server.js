'use strict';

const mongoose = require('mongoose');
const express = require('express');
const db = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/URLShortener';
mongoose.connect(db);
require('./models/Url.js');
const Url = mongoose.model('Url');
var validator = require('validator');

const app = express();

const port = (process.env.PORT || 5000);

app.set('port', port);

app.use(express.static(process.cwd() + '/public'));

app.get('/:url(*)', function(req, res){

	let input = req.params.url;
	let usedUrl = false;

	Url.find(function(err, urls){
		if(err){return};
		if(urls.length === 0){
			if(!validator.isURL(input, {require_tld: true, require_protocol: true})){
				res.json({"Error":'Not a valid URL.'});
				return
			}else{
				let newUrl = new Url();
				newUrl.originalUrl = input;
				newUrl.random = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
				newUrl.newUrl = ('http://jdf-shorturl.herokuapp.com/' + newUrl.random);

				newUrl.save(function(err, newUrl){
					if(err){return next(err);}
					res.json({"Original Url": newUrl.originalUrl, "New Url": newUrl.newUrl});
					return
				})
			}
		}else{
			for(var i = 0; i<urls.length; i++){
				if(parseInt(input) == urls[i].random){
					usedUrl = true;
					res.redirect(urls[i].originalUrl);
					return
				}

				else if(urls[i].originalUrl == input){
					usedUrl = true;
					res.json({"Original Url": urls[i].originalUrl, "New Url": urls[i].newUrl})
					return
				}
			};
			if(usedUrl == false){
				if(!validator.isURL(input, {require_tld: true, require_protocol: true})){
						res.json({"Error":'Not a valid URL.'});
						return
				}else{
					let newUrl = new Url();
					newUrl.originalUrl = input;
					newUrl.random = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
					newUrl.newUrl = ('http://jdf-shorturl.herokuapp.com/' + newUrl.random);

					newUrl.save(function(err, newUrl){
						if(err){return next(err);}
						
						res.json({"Original Url": newUrl.originalUrl, "New Url": newUrl.newUrl});
						return
					})	
				}
			}
		}
	});
});

app.listen(app.get('port'), function(){
	console.log('Server listening on port ' + port);
});