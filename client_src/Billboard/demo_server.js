var express = require('express');
var client = require('ibmiotf');
var parser = require('body-parser');
var request = require('request');

var config = require('./config.json');

const DELAY = 100;
const OK = 200;

var app = express();
var device = new client.IotfDevice(config);
var jsonParser = parser.json();

var ad = null;
var lock = true;
var cheat = null;

app.use(express.static(__dirname + '/public'));

app.get('/ad/:location', function (req, res) {
	if (cheat != null) {
		request('http://adstream.eu-gb.mybluemix.net/Ads', function (err, resp, body) {
			if (!err && resp.statusCode == 200) {
				body = JSON.parse(body);

				for (i = 0; i < body.length; i++) {
					if (cheat == 'mothers') {
						if (body[i].doc.category.Family && body[i].doc.category.Home) {
							res.json(body[i].id);
						}
					} else if (cheat == 'business') {
						if (body[i].doc.category.Buisiness &&
								body[i].doc.category.Automotive) {
							res.json(body[i].id);
						}
					}
				}
			}
		});
	} else {
		var failed = 1;
		var json = {"location" : req.params.location};
		device.publish('request', 'json', JSON.stringify(json), 2);

		/* Wait for the IoT callback to populate the ad */
		var timer = setInterval(function() {
			if (failed % 5 == 0) {
				console.log("Rescue!");
				device.publish('request', 'json', JSON.stringify(json), 2);
			}
			if (!lock) {
				res.json(ad);
				lock = true; /* Take the lock again */
				clearInterval(timer);
			} else {
				failed++;
			}
		}, DELAY);
	}
});

app.get('/rand', function (req, res) {
	request('http://adstream.eu-gb.mybluemix.net/Ads', function (err, resp, body) {
	  if (!err && resp.statusCode == 200) {
			body = JSON.parse(body);
			res.json(body[Math.floor(Math.random() * body.length)].id);
	  }
	});
});

app.post('/event/cheat/:type', function (req, res) {
	cheat = req.params.type
	res.sendStatus(OK);
});

app.post('/event/reset', function (req, res) {
	cheat = null;
	res.sendStatus(OK);
});

app.post('/event', jsonParser, function (req, res) {
	device.publish('device', 'json', JSON.stringify(req.body), 2);
	res.sendStatus(OK);
});

device.on("connect", function () {
  console.log("Connected to Iot Platform...");
});

device.on("command", function (commandName, format, payload, topic) {
  if (commandName === "displayAd") {
		var msg = JSON.parse(JSON.stringify(payload), (key, value) => {
    	return value && value.type === 'Buffer'
      ? Buffer.from(value.data)
      : value;
  	});
		ad = JSON.parse(msg).name;
		lock = false; /* Release the lock */
  } else {
    console.log("ERROR: Command not supported!");
  }
});

/* Do some error handling */
device.on("error", function (err) {
  console.error("ERROR: " + err);
});

app.listen(8085, '127.0.0.1', function () {
	console.log("Server started on localhost:8085...");
	device.connect();
});
