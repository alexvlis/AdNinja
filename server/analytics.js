/* System includes */
var Cloudant = require('cloudant');

/* Non-System includes */
var auth = require('./auth.js');

/* Definition of constants */
const AGGREGATE_VIEW = "aggregate";
const PEOPLE_DB = "people";
const HISTORY_DB = "history";
const LOCATIONS_DB = "locations";
const ADVERT_DB = "advertprofiles";
const MAX = 1;
const MIN = 0;
const THRESHOLD = 0.5;
const MAX_EUCLIDEAN = 5;

/* Module members */
const cloudant = Cloudant({account : auth.username, password : auth.password});
const advertDB = cloudant.db.use(ADVERT_DB);
const historyDB = cloudant.db.use(HISTORY_DB);
var previousAd = "";

/*
* Private module methods
*/
function make_profile () {
	var interest = {
    "Entertainment": 0,
    "Automotive": 0,
    "Buisiness": 0,
    "Careers": 0,
    "Education": 0,
    "Family": 0,
    "Fashion": 0,
    "Finance": 0,
    "Food": 0,
    "Health": 0,
    "Hobbies": 0,
    "Home": 0,
    "Politics": 0,
    "News": 0,
    "Pets": 0,
    "Real_Estate": 0,
    "Religion": 0,
    "Science": 0,
    "Shopping": 0,
    "Society": 0,
    "Sports": 0,
    "Technology": 0,
    "Travel": 0
  };
	/* Assemble the profile */
	var profile = {
		interest: interest,
		age: 0,
		gender: ''
	};
	return profile;
}

function sum (cumulative, profile) {
	/* Count the genders */
	if (profile.gender == 'Male') {
		this.male++;
	} else {
		this.female++;
	}
	/* Sum the interests */
	for (var field in profile.interests) {
		cumulative.interest[field] += profile.interests[field];
	}
	/* Sum all the ages */
	if (profile.age) {
		cumulative.age += profile.age;
	}
}

/* Normalise the interest */
function normalise (profile, people) {
	for (var field in profile.interest) {
		profile.interest[field] /= people;
	}
	/* Average the age */
	profile.age /= people;

	/* Work out the majority per gender */
	profile.gender = (this.male > this.female) ? 'Male' : 'Female';
}

function profile () {
	var db = cloudant.db.use(PEOPLE_DB);
	var profile = make_profile();
	var selector = null;
	var interests = null;
	var params = null;
	var range = null;

	/* Handle the optional arguments */
	var location = arguments[0]; /* Location is always first */
	var callback = arguments[arguments.length - 1]; /* The callback is last */

	/* Parse arguments */
	for (i = 1; i < arguments.length - 1; i++) {
		if (arguments[i].params) {
			params = arguments[i].params;
		} else if (arguments[i].range) {
			range = arguments[i].range.split('-');
		}
	}
	/* Build the basic selector */
	selector = {
		"selector": {
			"$and": [{"location": location}]
		}
	};
	/* Decide if this is historic or real-time */
	if (params) {
		/* FIXME: Same person can be in the same location twice in an hour */
		db = historyDB;
		selector.selector['$and'].push({"entrance.day": params.day});
		selector.selector['$and'].push({"entrance.hour": Number(params.hour)});
	}
	if (range) {
		selector.selector['$and'].push({"age": {"$lte":Number(range[1])}});
		selector.selector['$and'].push({"age": {"$gte":Number(range[0])}});
	}
	db.find(selector, function (err, result) {
		if (err) {
			return callback(err, profile);
		}
		for (i = 0; i < result.docs.length; i++) {
			sum(profile, result.docs[i]);
		}
		normalise(profile, result.docs.length);
		callback(err, profile);
	});
}

/*
* Module external methods
*/
function Analytics() {
	/* Initialise the module */
	this.cloudant = cloudant;
	this.male = 0;
	this.female = 0;
}

Analytics.prototype.match = function (adName, profile, callback) {
	var match = 0;
	var sum = 0;
	var distance = 0;
	var fields = 0;
	var weight = 1/3;
	var agematch = 0;
	var gendermatch = 0;

	advertDB.get(adName, {include_docs:true}, function (err, ad) {
		if (err) {
			return callback(err, 0);
		}
		/* Sum the square of the differences */
		for (var field in ad.category) {
			sum += Math.pow(profile.interest[field] - ad.category[field], 2);
			fields++;
		}
		/* Take the square root of the sum */
		interestmatch = Math.sqrt(sum)/Math.sqrt(fields);

		/* Check if the age range matches */
		var age = ad.age.split("-");
		if ((profile.age < age[MAX]) && (profile.age > age[MIN])) {
			agematch = 1;
		}
		/* Check if the genders match */
		if (ad.gender != 'Any') {
			if (ad.gender == profile.gender) {
				gendermatch = 1;
			}
		} else {
			weight = 0.5;
		}
		match += weight * interestmatch;
		match += weight * gendermatch;
		match += weight * agematch;
		match *= 100; /* Convert this to a percentage */
		callback(err, match);
	});
}

Analytics.prototype.population = function () {
	var db = this.cloudant.db.use(PEOPLE_DB);
	var selector = null;
	var interest = null;
	var params = null;
	var range = null;

	/* Parse arguments */
	var location = arguments[0]; /* Location is always first */
	var callback = arguments[arguments.length - 1]; /* The callback is last */

	for (i = 1; i < arguments.length - 1; i++) {
		if (arguments[i].params) {
			params = arguments[i].params;
		} else if (arguments[i].range) {
			range = arguments[i].range.split('-');
		} else if (arguments[i].interest){
			interest = arguments[i].interest;
		}
	}
	/* Build the basic selector */
	selector = {
		"selector": {"$and": [{"location": location}]}
	};
	if (params) {
		db = historyDB;
		selector.selector['$and'].push({"entrance.day": params.day});
		selector.selector['$and'].push({"entrance.hour": Number(params.hour)});
	}
	if (range) {
		selector.selector['$and'].push({"age": {"$lte":Number(range[1])}});
		selector.selector['$and'].push({"age": {"$gte":Number(range[0])}});
	}
	if (interest) {
		for (var field in interest.tags) {
			var json = {};
			json["interests." + interest.tags[field]] = {"$eq":1};
			selector.selector['$and'].push(json);
		}
	}
	db.find(selector, function(er, result) {
		callback(er, result.docs.length);
	});
}

Analytics.prototype.decide = function (location, callback) {
	var euclidean = MAX_EUCLIDEAN;
	var result = null;
	var sum = 0;
	var index = 0;
	var counter = -1;

	advertDB.list({include_docs:true}, function (err, body) {
		if (err) {
			return callback(err, null);
		}
		body.rows.forEach(function (doc) {
			profile(location, {range:doc.doc.age}, function (er, profile) {
				var sum = 0;
				index = ++counter;

				/* Skip the advert which was just shown */
				if (doc.doc._id == previousAd) {
					return;
				}
				for (var field in doc.doc.category) {
					sum += Math.pow(doc.doc.category[field] - profile.interest[field], 2);
				}
				/* Find the nearest neighbour */
				if (Math.sqrt(sum) < euclidean) {
					euclidean = Math.sqrt(sum);
					result = doc.doc._id;
				}
				if (index == body.rows.length - 1) {
					previousAd = result;
					callback(er, result);
				}
			});
		});
	});
}

Analytics.prototype.profile = profile;

module.exports = Analytics;
