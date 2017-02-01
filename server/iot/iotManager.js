var iotapp = require('ibmiotf');
var Cloudant = require('cloudant');

var config = require('./config.json');
var Analytics = require('../analytics.js');
var auth = require('../auth.js');

const PEOPLE_DB = "people";

var app = new iotapp.IotfApplication(config);
var analytics = new Analytics;
var cloudant = Cloudant({account : auth.username, password : auth.password});

var peopleDB = cloudant.db.use(PEOPLE_DB);

/******************************************************************************
************************* IoT Platform Implementation *************************
******************************************************************************/

/* IoT Callbacks */
app.on("connect", function () {
  app.subscribeToDeviceEvents("RPi");
  console.log("Connected to the IoT platform...");
});

/* Handle events from devices */
app.on("deviceEvent", function (type, id, eventType, format, payload) {
	/* Parse the paylaod */
	var msg = JSON.parse(JSON.stringify(payload), (key, value) => {
		return value && value.type === 'Buffer'
		? Buffer.from(value.data)
		: value;
	});
	if (eventType == "request") {
		analytics.decide(JSON.parse(msg).location, function (err, name) {
			if (err) {
				return console.error("ERROR: " + err.message);
			}
			var data = {'name' : name};
      app.publishDeviceCommand("RPi", "1", "displayAd", "json",
																	JSON.stringify(data));
		});
	} else if (eventType == "device") {
		peopleDB.find({selector:{"MAC":JSON.parse(msg).mac}}, function (err, result) {
			if (err) {
				return console.error("ERROR: " + err.message);
			}
			if (JSON.parse(msg).type == "entry") {
				result.docs[0].location = JSON.parse(msg).loc;
			} else if (JSON.parse(msg).type == "exit") {
				result.docs[0].location = "unknown";
			}
			peopleDB.insert(result.docs[0], result.docs[0]._id, function (er, body) {
				if (er) {
					console.error("ERROR: " + er.message);
				}
			});
		});
	}
});

/* Do some error handling */
app.on("error", function (err) {
  console.log("ERROR: " + err);
});

app.connect();
