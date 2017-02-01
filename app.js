/*
* node.js back-end server for AdNinja
*/

/* System includes */
var express = require('express');
var cfenv = require('cfenv');
var Cloudant = require('cloudant');
var parser = require('body-parser');

/* Non-system includes */
var auth = require('./server/auth.js');
var nano = require('nano')(auth.url);
var Analytics = require('./server/analytics.js');

/* Definition of constants */
/* HTTP status codes */
const NOT_FOUND = 404;
const OK = 200;
const BAD = 400;

/* Database names */
const PEOPLE_DB = "people";
const HISTORY_DB = "history";
const LOCATIONS_DB = "locations";
const ADVERT_DB = "advertprofiles"

/* Definition of global variables */
var app = express();
var appEnv = cfenv.getAppEnv();
var cloudant = Cloudant({account:auth.username, password:auth.password});
var jsonParser = parser.json();
var analytics = new Analytics();

/* Express Setup */
app.use(express.static(__dirname + '/public'));
app.use(parser.json({ type: 'application/*+json' }));
app.use(function (req, res, next) {
	/* Modify the headers */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  /* Pass to next layer of middleware */
  next();
});

/******************************************************************************
************************** REST API Implementation ****************************
******************************************************************************/

/*
* GET callbacks
*/

/* Serve home page */
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

/* Dump the whole database */
app.get('/database', function (req, res) {
  var people = cloudant.db.use(PEOPLE_DB);

  people.list({ include_docs : true }, function (err, body) {
      if (err) {
        return console.log("ERROR: " + err.message);
      }
      res.json(body.rows);
  });
});

/* Return the locations of the billboards */
app.get('/locations', function (req, res) {
  var locations = cloudant.db.use(LOCATIONS_DB);

  locations.list({ include_docs : true }, function (err, body) {
    if (err) {
      return res.status(BAD).send(err.message);
    }
    res.json(body.rows);
  });
});

/* Send the number of people currently at a specific location */
app.get('/:location/people', function (req, res) {
	analytics.population(req.params.location, function (err, people) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(people);
	});
});

/* Get the number of people at a location at a specific day */
app.get('/:location/:day/:hour/people', function(req, res) {
	analytics.population(req.params.location, {params:req.params},
	function (err, people) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(people);
	});
});

/* Get the aggregate profile for each location at each hour */
app.get('/:location/:day/:hour/profile', function (req, res) {
	analytics.profile(req.params.location, {params:req.params}, function (err, profile) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(profile);
	});
});

/* Send the aggregate profile at the requested location */
app.get('/:location/profile', function (req, res) {
	analytics.profile(req.params.location, function (err, profile) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(profile);
	});
});

/* Dump all the ads we have in the advert database */
app.get('/Ads', function (req,res) {
	var advertDB = cloudant.db.use(ADVERT_DB);

	advertDB.list({ include_docs : true }, function (err, body) {
      if (err) {
				return res.status(BAD).send(err.message);
      }
      res.json(body.rows);
  });
});

/* Get the percentage match of the ad at a specific hour */
app.get('/:location/:Ad/:day/:hour/match', function(req, res) {
	analytics.profile(req.params.location, {params:req.params}, function (err, profile) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		analytics.match(req.params.Ad, profile, function (e, match) {
			if (e) {
				return res.status(BAD).send(e.message);
			}
			res.json(match);
		});
	});
});

app.get('/:location/:Ad/match', function (req, res) {
	analytics.profile(req.params.location, function (err, profile) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		analytics.match(req.params.Ad, profile, function (e, match) {
			if (e) {
				return res.status(BAD).send(e.message);
			}
			res.json(match);
		});
	});
});

app.get('/:location/:range/people', function (req, res) {
	analytics.population(req.params.location, {range:req.params.range},
	function (err, people) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(people);
	});
});

app.get('/:location/:range/profile', function (req, res) {
	analytics.profile(req.params.location, {range:req.params.range},
	function (err, profile) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(profile);
	});
});

app.get('/:location/:day/:hour/:range/people', function (req, res) {
	analytics.population(req.params.location, {params:req.params},
												{range:req.params.range}, function (err, people) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(people);
	});
});

app.get('/:location/:day/:hour/:range/profile', function (req, res) {
	analytics.profile(req.params.location, {params:req.params},
											{range:req.params.range},
	function (err, profile) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(profile);
	});
});

app.get('/Ads/:adName', function (req, res) {
	var advertDB = cloudant.db.use(ADVERT_DB);

	advertDB.get(req.params.adName, function (err, body) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(body);
	});
});

/*
* POST callbacks
*/
/* Ad new ads to the database */
app.post('/Ads/add', jsonParser, function (req, res) {
	var advertDB = cloudant.db.use(ADVERT_DB);

	advertDB.insert(req.body.profile, req.body.name, function (err, body) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
	  res.sendStatus(OK);
	});
});

/* Handle a POST message that contains a json array of interests */
app.post('/:location/:day/:hour/:range/people', jsonParser, function (req, res) {
	analytics.population(req.params.location, {params:req.params},
												{range:req.params.range}, {interest:req.body.interest},
	function(err, people) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(people);
	});
});

app.post('/:location/:day/:hour/people', jsonParser, function (req, res) {
	analytics.population(req.params.location, {params:req.params},
												{interest:req.body.interest},
	function(err, people) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(people);
	});
});

app.post('/:location/people', jsonParser, function (req, res) {
	analytics.population(req.params.location, {interest:req.body.interest},
	function(err, people) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		res.json(people);
	});
});

/*
* DELETE callbacks
*/
app.delete('/Ads/:Ad', function (req, res) {
	var advertDB = cloudant.db.use(ADVERT_DB);

	advertDB.get(req.params.Ad, function (err, body) {
		if (err) {
			return res.status(BAD).send(err.message);
		}
		advertDB.destroy(req.params.Ad, body._rev, function (e) {
			if (e) {
				return res.status(BAD).send(e.message);
			}
			res.sendStatus(OK);
		})
	});
});

/******************************************************************************
************************************ MAIN *************************************
******************************************************************************/

/* Start server on the specified port and binding host */
app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("Server starting on " + appEnv.url + "...");

});
