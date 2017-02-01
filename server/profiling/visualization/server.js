var express = require('express');
var fs = require('fs');

var app = express();
var filename = null;

const NOT_FOUND = 404;
const BAD = 400;
const INTERNAL_SERVER_ERROR = 500;

app.use(express.static(__dirname + '/public'));

app.get('/donut/:name', function (req, res) {
	filename = String('../results/' + req.params.name + ".json");
	res.sendFile(__dirname + '/public/donut.html');
});

app.get('/profile', function (req, res) {
	if (!filename) {
		return res.sendStatus(INTERNAL_SERVER_ERROR);
	}
	fs.readFile(filename, function (err, data) {
		if (err) {
			res.sendStatus(BAD);
			return console.log(err.message);
		}
		res.json(JSON.parse(data));
	});
});

app.listen('8086', '0.0.0.0', function() {
  console.log("Server starting on localhost:8086...");
});
