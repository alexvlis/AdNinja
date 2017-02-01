var Cloudant = require('cloudant');
var auth = require('../auth.js');

const HISTORY_DB = "history";
const PEOPLE_DB = "people";

var cloudant = Cloudant({account:auth.username, password:auth.password});
var historyDB = cloudant.db.use(HISTORY_DB);
var peopleDB = cloudant.db.use(PEOPLE_DB);

historyDB.list({include_docs:true}, function (err, body) {
	if (err) {
		console.error("ERROR: " + err.message);
	}
	body.rows.forEach(function (doc) {
		peopleDB.get(doc.doc.email, function (er, bod) {
			if (bod) {
				doc.doc.interests = bod.interests;
				doc.doc.gender = bod.gender;
				doc.doc.age = bod.age;
				historyDB.insert(doc.doc, doc.doc._id, function (e, b) {
					if (e) {
						console.error("ERROR: " + e.message);
					}
				});
			}
		});
	});
});
