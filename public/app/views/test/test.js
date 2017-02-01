// http://adstream.eu-gb.mybluemix.net/Ads/add
angular.module('adstream-app')
.controller('testController', ['$scope', '$http', //controllers have JS that control the app
function($scope, $http) {// $scope is a way of making variables public to outside the controller (HTML)
  $scope.postForm = function (name, company, category, file, description, gender, age, threshold) { //need $scope for function definitions too
    var toSend = {
      "name": String(name),
      "profile": {
        "company": String(company),
        "category": String(category),
        "file": String(file),
        "description": String(description),
        "gender": String(gender),
        "age": String(age),
        "threshold": String(threshold)
      }
    };

    // var toSend = {
    // "name": "Sam is great 1234",
    // "profile": {
    //     "category": {
    //         "Entertainment": 1
    //       }
    //   }
    // }

    $scope.toPrint = toSend;

    $http.post("/Ads/add", toSend)
    .then(function(response) {
      console.log("sent!")
    }, function(response) {
      console.log("Error 123")
    });
  }
  }
]);
