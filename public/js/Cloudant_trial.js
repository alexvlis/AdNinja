require('dotenv').load();


var faker = require('faker');
var Chance = require('chance');
var chance = new Chance();
var profile_array = [];
var rand = []



for (i=0; i<100; i++){
  var name1 = faker.name.firstName();
  var name2 = faker.name.lastName();
  var likesArray = {
    Sports: Math.round(Math.random()),
    Music: Math.round(Math.random()),
    Tech: Math.round(Math.random()),
    Food: Math.round(Math.random()),
    Fashion: Math.round(Math.random()),
    Holidays: Math.round(Math.random()),
  };
  var myArray = ['@gmail.com', '@hotmail.com', '@yahoo.com', '@virgin.net', '@talktalk.net', '@aol.com', '@icloud.com'];
  var rand = myArray[Math.floor(Math.random() * myArray.length)];
  var newArray = ['Waterloo', 'Twickenham', 'O2 stadium'];
  var newRand = newArray[Math.floor(Math.random() * newArray.length)];
  var user = {
    firstName: name1,
    lastName: name2,
    number: chance.phone({ country: 'uk', mobile: true }),
    MAC: faker.internet.mac(),
    email: name1 + "." + name2 + rand,
    gender:chance.gender(),
    age: chance.age(),
    address: faker.address.streetAddress(),
    //GPS: chance.coordinates(),
    likes: likesArray,
    location: newRand,
  };

  profile_array[i]=user;
};

//console.log(profile_array);






// Load the Cloudant library.
var Cloudant = require('cloudant');

// Initialize Cloudant with settings from .env
var username = "1e012ece-9e7b-48ed-b179-bc1abc302a67-bluemix";
var password = "7fed18664b09afdc9fb9687c2d41347eaf643aae8b3c364df724ef805acf56e6";
var cloudant = Cloudant({account:username, password:password});

// Remove any existing database called "people".
//cloudant.db.destroy('people', function(err) {

  // Create a new "people" database.
  cloudant.db.create('people', function() {

    // Specify the database we are going to use (people)...
    var people = cloudant.db.use('people')

    // ...and insert a document in it.
    for (i=0; i<profile_array.length; i++){
      people.insert(profile_array[i], profile_array[i]['email'], function(err, body, header) {
        if (err) {
          return console.log('[people.insert] ', err.message);
        }
        console.log(body);
      });
    }
  });
//});
