var Cloudant = require('cloudant');
var auth = require('../auth.js');

const PEOPLE_DB = "people";

var cloudant = Cloudant({account:auth.username, password:auth.password});
var peopleDB = cloudant.db.use(PEOPLE_DB);

peopleDB.list({include_docs:true}, function (err, body) {
	body.rows.forEach(function (doc) {
		console.log('"' + doc.doc.MAC + '",');
	});
	console.log(body.rows.length);
});
