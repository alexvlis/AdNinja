'use strict';

angular.module('adstream-app')
    .controller('locationsMap', function($scope, $http) {
var o2content;
var WLcontent;
var TWcontent;
var numpeeps;
var o21=0;
var o21index=0;
var o21field;
var o22=0;
var o22index=0;
var o22field;
var o23=0;
var o23index=0;
var o23field;
var graphcanvas='<div style="max-width:400px"><canvas id="lineChart" width="400px" height="400px"></canvas></div>';
function gettext(){
      $http({
        method: 'GET',
        url: '/Waterloo1/people'
      }).then(function successCallback(response) {
      $scope.response = response.data
      numpeeps=response.data;

                $http({
                  method: 'GET',
                  url: '/Waterloo1/profile'
                }).then(function successCallback(response) {
                $scope.response = response.data;
                var a=response.data.interest;
                var fields=[];
                var data=[];
                for (var field in a) {
                  data.push(a[field]);
                  fields.push(field);
                }
                // console.log(data)
                for(var i=0;i<data.length-2;i++){
                  if(data[i]>o21){
                    o21=data[i];
                    o21index=i;
                    o21field=fields[o21index];
                  }
                }
                for(var i=0;i<data.length-2;i++){
                  if(data[i]>o22 && i !=o21index){
                    o22=data[i];
                    o22index=i;
                    o22field=fields[o22index];
                  }
                }
                for(var i=0;i<data.length-2;i++){
                  if(data[i]>o23 && i !=o21index && i !=o22index){
                    o23=data[i];
                    o23index=i;
                    o23field=fields[o23index];
                  }
                }
                console.log(o22field);

                WLcontent='<b><u> Waterloo Station</u></b><br>' +
                '<b>No. of people:</b><br> ' + numpeeps + '<br>'+
                '<b>Top interests:</b>'+'<br>'+  o21field + ' ' + Math.round(o21*100) + '%'+ '<br>' +
                                    o22field + ' ' + Math.round(o22*100)+ '%'+'<br>' +
                                    o23field + ' ' + Math.round(o23*100)+'%'+graphcanvas;

                  }, function errorCallback(response) {
                    console.log("failed to get data")
                  });

        }, function errorCallback(response) {
          console.log("failed to get data")
        });
};

        gettext();
        // if (numpeeps==undefined){
        //   numpeeps="0";
        //   console.log("error")
        // }
      // function initMap() {
  var waterlooLatLng = new google.maps.LatLng(51.5032,  -0.1100);
  var o2ArenaLatLng = new google.maps.LatLng(51.5032,  0.0000);
  var twickenhamLatLng = new google.maps.LatLng(51.4559,  -0.3415);
  var infoWindow;


 var image = new google.maps.MarkerImage('/images/Purple_nina_3.png');

  var map = new google.maps.Map(document.getElementById('google-maps'), {
    zoom: 12,
    disableDefaultUI: true,
    center: {lat: 51.5032, lng: -0.1100},
    styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
]
  });

  var waterlooMarker = new google.maps.Marker({
    position: waterlooLatLng,
    map: map,
    icon: image,
    title: 'Waterloo Station',
  });

  waterlooMarker.addListener('click', function() {
          map.setZoom(17);
          map.setCenter(waterlooMarker.getPosition());

          gettext();
          getdata();


          // infoWindow.setContent("0");
          infoWindow.setPosition(waterlooLatLng);
          infoWindow.setContent(WLcontent);
          infoWindow.open(map);
          updateinfo();



        });

  function updateinfo(){
    setInterval(function(){
      gettext();
      getdata();
      infoWindow.setContent(WLcontent);
      //updateinfo();
    }, 4000);
  };
  // marker.addListener('click', function() {
  //   infowindow.open(map, marker);
  // });


  var o2ArenaMarker = new google.maps.Marker({
    position: o2ArenaLatLng,
    map: map,
    icon:image,
    title: 'O2 Arena'
  });

  o2ArenaMarker.addListener('click', function() {
          map.setZoom(17);
          map.setCenter(o2ArenaMarker.getPosition());
          getdata();
          infoWindow.setContent(o2content);
          infoWindow.setPosition(o2ArenaLatLng);
          infoWindow.open(map);
        });
  // marker.addListener('click', function() {
  //   infowindowO2.open(map, marker);
  // });

  var twickenhamMarker = new google.maps.Marker({
    position: twickenhamLatLng,
    map: map,
    icon:image,
    title: 'Twickenham Stadium'
  });

infoWindow = new google.maps.InfoWindow();

  twickenhamMarker.addListener('click', function() {
          map.setZoom(17);
          map.setCenter(twickenhamMarker.getPosition());
          getdata();
          infoWindow.setContent(TWcontent);
          infoWindow.setPosition(twickenhamLatLng);
          infoWindow.open(map);
        });



  // marker.addListener('click', function() {
  //   infowindowTwickenham.open(map, marker);
  // });

// }

var centerControlDiv = document.createElement('div');
       var centerControl = new CenterControl(centerControlDiv, map);

       centerControlDiv.index = 1;
       map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Overview';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          map.setCenter(waterlooLatLng);
          map.setZoom(12);
          infoWindow.close(map);
        });

      }
      //Data from locationFurtherInfoTester
      // getdata();

      function getdata(){
              var collectedData = $.ajax ({
                                  url: "/Waterloo1/profile",
                                  type: "GET",
                                  // data: JSON.stringify(postevent),
                                  dataType: "json",
                                  contentType: "application/json; charset=utf-8",
                                  success: function(){
                                    console.log("done");
                                    var temp =(JSON.parse(collectedData.responseText).interest);
                                    console.log(temp);
                                    drawgraph(temp);

                                  }
                      });

      };
      // console.log(collectedData);
      // console.log(JSON.parse(collectedData.responseText));

      function drawgraph(a){
              const CHART = document.getElementById("lineChart");
              var fields=[];
              var data=[];
              for (var field in a) {
                data.push(a[field]);
                fields.push(field);
              }
              // for(var i=0;i<data.length+1;i++){
              //   if(data[i]>o21){
              //     o21=data[i];
              //     o21index=i;
              //     o21field=fields[o21index];
              //   }
              // }
              // console.log(fields[o21index]);
              let lineChart= new Chart(CHART, {
                type: 'radar',
                // max-height: 50,
                // animation:false,
                data: {
                      labels: fields,

                      datasets: [{
                          label: 'Current Interests',
                          data: data,
                          fill:true,
                          tension:0.1,
                          backgroundColor:'rgba(255, 0, 0, 0.2)',
                          borderColor:'rgba(255, 0, 0, 1)',
                          borderWidth: 1,

                      }]
                  },
                  options:{
                    animation:false,
                    scale: {
                      ticks: {
                          min: 0,
                          max:1
                      },
                      afterBuildTicks: function (chart) {
                        chart.ticks = [];
                        chart.ticks.push(0);
                        chart.ticks.push(0.2);
                        chart.ticks.push(0.4);
                        chart.ticks.push(0.6);
                        //chart.ticks.push(0.8);
                        chart.ticks.push(1);
                      }
                  }
                  }
              });

            };
  })
