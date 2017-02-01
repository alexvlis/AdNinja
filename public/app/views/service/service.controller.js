'use strict';

angular.module('adstream-app')
.controller('service', function($scope, $http){
$http({
  method: 'GET',
  url: '/Ads'
}).then(function successCallback(response) {
$scope.response = response.data
  }, function errorCallback(response) {
    console.log("failed to get data")
  });
});
