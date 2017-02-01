'use strict';

angular.module('adstream-app')
.controller('create', ['$scope', '$http', //controllers have JS that control the app
function($scope, $http) {// $scope is a way of making variables public to outside the controller (HTML)
  $scope.postForm = function (name, company, description, age1,age2,age3,age4,age5,gender1,gender2,demo1,demo2,demo3,demo4,demo5,demo6,demo7,demo8,demo9,demo10,demo11,demo12,demo13,demo14,demo15,demo16,demo17,demo18,demo19,demo20,demo21,demo22,demo23,fileURL) { //need $scope for function definitions too
    var age=age1||age2||age3||age4||age5;
    var gender="error";
    if (gender1 == undefined & gender2 !=undefined){
      gender= "female";
    };
    if (gender1 != undefined & gender2 ==undefined){
      gender= "male";
    };
    if (gender1 != undefined & gender2 !=undefined){
      gender= "both";
    };
    var demoarray=[demo1,demo2,demo3,demo4,demo5,demo6,demo7,demo8,demo9,demo10,demo11,demo12,demo13,demo14,demo15,demo16,demo17,demo18,demo18,demo19,demo20,demo21,demo22,demo23];
    var demonames=["Entertainment","Automotive","Buisiness","Careers","Education","Family","Fashion","Finance","Food","Health","Hobbies","Home","Politics","News","Pets","Real_Estate","Religion","Science","Shopping","Society","Sports","Technology","Travel"];
    console.log(demoarray);
    var demoToPush={};
    for(var i=0;i<demoarray.length;i++){
      if(demoarray[i] ==true){
      demoToPush[demonames[i]]=1;
      }
    }
    console.log(demoToPush);
    var toSend = {
      "name": String(name),
      "profile": {
        "company": String(company),
        "category": demoToPush,

        "file": String(fileURL),
        "description": String(description),
        "gender": String(gender),
        "age": String(age),
      }
    };

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
