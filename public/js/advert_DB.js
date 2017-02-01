//require('dotenv').load();

var advertArray = [];

var ikeaAdvert = {
 advertName: "Ikea Table Advert",
 company: "Ikea",
 category: ["Home", "Family", "Real Estate", "Shopping"],
 file:"https://www.youtube.com/watch?v=GzCLshtTnxg",
 description:"Ikea.. blah..blah..blah",
 gender:"Female",
 age:"35-45",
 threshold:"50"
};
advertArray.push(ikeaAdvert);

var cokeAdvert = {
 advertName: "Diet Coke Advert",
 company: "Coca-Cola",
 category: ["Food", "Family", "Entertainment"],
 file:"https://www.youtube.com/watch?v=0oYlOBun8UI",
 description:"Coke...blah...blah...blah",
 gender:"Any",
 age:"15-50",
 threshold:"25"
};
advertArray.push(cokeAdvert);

var amazonAdvert = {
 advertName: "Amazon Kindle Advert",
 company: "Amazon",
 category: ["Entertainment", "News", "Travel"],
 file:"https://www.youtube.com/watch?v=nVEkx-XFL1A",
 description:"Kindle...blah...blah...blah",
 gender:"Any",
 age:"25-35",
 threshold:"30"
};
advertArray.push(amazonAdvert);

var thaiLifeInsurance = {
 advertName: "Thai Life Insurance Advert",
 company: "Thai Life Insurance",
 category: ["Health", "Family", "Finance"],
 file:"https://www.youtube.com/watch?v=K9vFWA1rnWc",
 description:"Life Insurance...blah...blah...blah",
 gender:"Any",
 age:"25-55",
 threshold:"60"
};
advertArray.push(thaiLifeInsurance);



// Load the Cloudant library.
var Cloudant = require('cloudant');

// Initialize Cloudant with settings from .env
var username = "1e012ece-9e7b-48ed-b179-bc1abc302a67-bluemix";
var password = "7fed18664b09afdc9fb9687c2d41347eaf643aae8b3c364df724ef805acf56e6";
var cloudant = Cloudant({account:username, password:password});

// Remove any existing database called "advertprofiles".
cloudant.db.destroy('advertprofiles', function(err) {

  // Create a new "advertprofiles" database.
  cloudant.db.create('advertprofiles', function() {

    // Specify the database we are going to use (advertprofiles)...
    var advertprofiles = cloudant.db.use('advertprofiles')

    // ...and insert a document in it.
    for (i=0; i<advertArray.length; i++){
      advertprofiles.insert(advertArray[i], advertArray[i]['advertName'], function(err, body, header) {
        if (err) {
          return console.log('[advertprofiles.insert] ', err.message);
        }
        console.log(body);
      });
    }
  });
});






























// // Load the Cloudant library.
// var Cloudant = require('cloudant');
//
// // Initialize Cloudant with settings from .env
// var username = "1e012ece-9e7b-48ed-b179-bc1abc302a67-bluemix";
// var password = "7fed18664b09afdc9fb9687c2d41347eaf643aae8b3c364df724ef805acf56e6";
// var cloudant = Cloudant({account:username, password:password});
//
// // Remove any existing database called "advertProfiles".
// cloudant.db.destroy('advertprofiles', function(err) {
//   if (err) {
//    return console.log(err.message);
//   }
//   console.log("Deleted DB");
//   // Create a new "advertProfiles" database.
//   cloudant.db.create('advertprofiles', function(err, body) {
//     if (err) {
//       console.log(err.message);
//     }
//     console.log("Created DB");
//
//     // Specify the database we are going to use (advertProfiles)...
//     var advertprofiles = cloudant.db.use('advertprofiles');
//     console.log('Using DB');
//
//     // ...and insert a document in it.
//     for (i=0; i<advertArray.length; i++) {
//       console.log("Hi");
//       advertprofiles.insert(advertArray[i], advertArray[i].advertName, function(err, body, header) {
//         if (err) {
//           return console.log('[advertprofiles.insert] ', err.message);
//         }
//         console.log(body);
//       });
//     }
//   });
//});
