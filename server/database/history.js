/* System includes */
var Cloudant = require('cloudant');

/* Non-system includes */
var auth = require('../auth.js');
var S = require('./stats.js');

/* Definition of constants */
const HISTORY_DB = "history";
const PEOPLE_DB = "people";
const DEPTH = 20; //FIXME: 1 week's worth of 5 mins

/* Definition of global variables */
var cloudant = Cloudant({account:auth.username, password:auth.password});
var locations = [];
var historyDB = null;
var stat = new S;

/* Populate the locations array with key-value pairs */
locations.push({
	name: "Twickenham",
	probability: 0.15
});
locations.push({
	name: "O2 Stadium",
	probability: 0.15
});
locations.push({
	name: "Waterloo",
	probability: 0.7
});

/* Populate the database */
var peopleDB = cloudant.db.use(PEOPLE_DB);
historyDB = cloudant.db.use(HISTORY_DB);

peopleDB.list({include_docs:true}, function (err, body) {
	if (err) {
		console.error("ERROR: " + err.message);
	}
	process.stdout.write("Populating the database...");
	body.rows.forEach(function (row) {
		for (i = 0; i < DEPTH; i++) {
			var location = locations[stat.selector(locations)].name;

			var snapshot = {
				email: row.doc.email,
				location: location,
				entrance: stat.time_entrance(location),
				exit: stat.time_exit(location)
			};
			historyDB.insert(snapshot, function (err, body) {
				if (err) {
					console.error("ERROR: " + err.message);
				}
			});
		}
	});
});
console.log(" Done");
