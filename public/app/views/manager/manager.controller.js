'use strict';
angular.module('adstream-app')
.controller('manager', function($scope, $http){
$http({
  method: 'GET',
  url: '/Ads'
}).then(function successCallback(response) {
$scope.response = response.data

companyParse(response.data, function(advertList){
  $scope.advertList = advertList;
  console.log(advertList);
  $scope.companies = Object.keys(advertList);
  $scope.accordion = {}
  for (var item in $scope.companies) {
    $scope.accordion[$scope.companies[item]]=1;
  }
  $scope.toggle = function(company) {
    console.log(company);
    $scope.accordion[company] =!$scope.accordion[company];
  }
  console.log(Object.keys(advertList));
});

  }, function errorCallback(response) {
    console.log("failed to get data")
  });

  function companyParse(adverts, callback){

    var advertList={};

    for (var advert in adverts){
      var company = adverts[advert].doc.company;

      if (!advertList.hasOwnProperty(company)){
      advertList[company] = [];
    }
      advertList[company].push(adverts[advert]);
    }

    callback(advertList);
  }


$scope.deleteAd = function(name){
  var temp = "/Ads/" + name;
	console.log("button working for " + name);
  if (confirm("Darling, are you sure you want to delete " + name + "? It's so hot right now!") == true) {
		console.log("Sending http delete");
    $http.delete(temp)
    .then(function(response) {
      console.log("sent!")
    }, function(response) {
      console.log("Error 123")
    });
    window.location.reload()
	}
}

// console.log("function done")
  var advertImages = ["https://i.ytimg.com/vi/UcmFrercG_Y/maxresdefault.jpg","http://images.radiotimes.com/namedimage/Diet_Coke__hunk__ad_is_heading_back_to_TV.jpg?quality=85&mode=crop&width=620&height=374&404=tv&url=/uploads/images/original/24095.jpg", "http://www.a1animals.co.uk/images/g4_large.jpg", "https://i.ytimg.com/vi/uaWA2GbcnJU/maxresdefault.jpg" ];

});
