var Cloudant = require('cloudant');
var auth = require('../auth.js');
var cloudant = Cloudant({account:auth.username, password:auth.password});

const HISTORY_DB = "history";
const PEOPLE_DB = "people";

var historyDB = cloudant.db.use(HISTORY_DB);
var peopleDB = cloudant.db.use(PEOPLE_DB);

var email = {name:'email', type:'json', index:{fields:['email']}};
var gender = {name:'gender', type:'json', index:{fields:['gender']}};
var location = {name:'location', type:'json', index:{fields:['location']}};
var mac = {name:'mac', type:'json', index:{fields:['MAC']}};
var age = {name:'age', type:'json', index:{fields:['age']}};

peopleDB.index(age, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

peopleDB.index(email, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

peopleDB.index(gender, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

peopleDB.index(location, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

peopleDB.index(mac, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

var day = {name:'day', type:'json', index:{fields:['entrance.day']}};
var hour = {name:'hour', type:'json', index:{fields:['hour']}};

var interestEntertainment = {name:'Entertainment', type:'json', index:{fields:['interests.Entertainment']}};
var interestAutomotive = {name:'Automotive', type:'json', index:{fields:['interests.Automotive']}};
var interestBuisiness = {name:'Buisiness', type:'json', index:{fields:['interests.Buisiness']}};
var interestCareers = {name:'Careers', type:'json', index:{fields:['interests.Careers']}};
var interestEducation = {name:'Education', type:'json', index:{fields:['interests.Education']}};
var interestFamily = {name:'Family', type:'json', index:{fields:['interests.Family']}};
var interestFashion = {name:'Fashion', type:'json', index:{fields:['interests.Fashion']}};
var interestFinance = {name:'Finance', type:'json', index:{fields:['interests.Finance']}};
var interestFood = {name:'Food', type:'json', index:{fields:['interests.Food']}};
var interestHobbies = {name:'Hobbies', type:'json', index:{fields:['interests.Hobbies']}};
var interestHome = {name:'Home', type:'json', index:{fields:['interests.Home']}};
var interestPolitics= {name:'Politics', type:'json', index:{fields:['interests.Politics']}};
var interestNews= {name:'News', type:'json', index:{fields:['interests.News']}};
var interestPets= {name:'Pets', type:'json', index:{fields:['interests.Pets']}};
var interestReal_Estate= {name:'Real_Estate', type:'json', index:{fields:['interests.Real_Estate']}};
var interestReligion= {name:'Religion', type:'json', index:{fields:['interests.Religion']}};
var interestScience= {name:'Science', type:'json', index:{fields:['interests.Science']}};
var interestShopping= {name:'Shopping', type:'json', index:{fields:['interests.Shopping']}};
var interestSociety= {name:'Society', type:'json', index:{fields:['interests.Society']}};
var interestTechnology= {name:'Technology', type:'json', index:{fields:['interests.Technology']}};
var interestTravel= {name:'Travel', type:'json', index:{fields:['interests.Travel']}};

historyDB.index(interestTravel, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestTechnology, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestSociety, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestShopping, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestScience, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestReligion, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestReal_Estate, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestPets, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestNews, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestPolitics, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestHome, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestHobbies, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestFood, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestFinance, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestFashion, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestFamily, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestEducation, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestEntertainment, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestAutomotive, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestBuisiness, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(interestCareers, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(email, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(gender, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(location, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(mac, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(day, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(hour, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

historyDB.index(age, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});

peopleDB.find({selector:{"location":"Twickenham"}}, function(er, result) {
  if (er) {
    throw er;
  }
	var sum = 0;

  console.log('Found %d documents with name Alice', result.docs.length);
  for (var i = 0; i < result.docs.length; i++) {
		sum += result.docs[i].age;
  }
	console.log('  Av age: %s', sum/result.docs.length);
});

// 	historyDB.find({selector:{"$and":[{location: 'Waterloo'},{"entrance.day": 'Mon'}]}}, function(er, result) {
//   if (er) {
//     throw er;
//   }
//   console.log('Found %d people in waterloo on monday', result.docs.length);
//   for (var i = 0; i < result.docs.length; i++) {
//     console.log('  Doc id: %s', result.docs[i].email);
//   }
// });
