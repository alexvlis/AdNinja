// Load the Cloudant library.
var Cloudant = require('cloudant');
var events = require('events');
var eventEmitter = new events.EventEmitter();

// Initialize Cloudant with settings from .env
var username = "1e012ece-9e7b-48ed-b179-bc1abc302a67-bluemix";
var password = "7fed18664b09afdc9fb9687c2d41347eaf643aae8b3c364df724ef805acf56e6";
var cloudant = Cloudant({account:username, password:password});

var people = cloudant.db.use('people');
var listNames = [];

var something = function () {
  // Remove any existing database called "people".
  cloudant.db.destroy('peoplehistory', function(err) {

 // Create a new "peopleHistory" database.
    cloudant.db.create('peoplehistory', function(err, body) {
      if (err){
        return console.log(err.message);
      }
      // Specify the database we are going to use (peopleHistory)...
      var peopleHistory = cloudant.db.use('peoplehistory')
      var myJsonString = JSON.stringify(listNames);
      console.log(myJsonString);
      // ...and insert a document in it.
      for (i=0; i<listNames.length; i++) {
        peopleHistory.insert(myJsonString[i], function(err, body, header) {
          if (err) {
            return console.log('[peoplehistory.insert] ', err.message);
          }
          console.log(body);
        });
      }
    });
  });
}

eventEmitter.on('done', something);
people.list({ include_docs : true }, function (err, body) {
     if (err) {
       return console.log("ERROR: " + err.message);
     }
     body.rows.forEach(function(row) {
        //console.log(row.doc.firstName);
        var person = row.doc.firstName + row.doc.lastName;
        listNames.push(person);
        console.log(listNames);
     });
     eventEmitter.emit('done');
 });
