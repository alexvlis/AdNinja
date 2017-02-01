'use strict';

angular.module('adstream-app', ['ui.router'])

.config(function($urlRouterProvider, $stateProvider) {
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  $stateProvider

  .state('homepage', {
    url: '/',
    templateUrl: 'app/views/homePage/homepage.html',
    controller: 'Homepage'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'app/views/login/login.html',
    controller: 'Login'
  })

  .state('app', {
    url: '/app',
    templateUrl: 'app/views/container/container.html',
    abstract: true
  })

  .state('app.create', {
    url: '/create',
    templateUrl: 'app/views/create/create.html',
    controller: 'create'
  })

  .state('app.locations', {
    url: '/locations',
    templateUrl: 'app/views/locations/locations.html',
    controller: 'locationsMap'
  })

  .state('app.manager', {
    url: '/manager',
    templateUrl: 'app/views/manager/manager.html',
    controller: 'manager'
  })

  .state('app.test', {
    url: '/test',
    templateUrl: 'app/views/test/test.html',
    controller: 'testController'
  })

  .state('app.service', {
    url: '/service',
    templateUrl: 'app/views/service/service.html',
    controller: 'service'
  })
  .state('app.locationFurtherInfoTester', {
    url: '/locationFurtherInfoTester',
    templateUrl: 'app/views/locationFurtherInfoTester/locationFurtherInfoTester.html',
    controller: 'locationFurtherInfoTester'
  })

  .state('app.advertsMatch', {
    url: '/advertsMatch',
    templateUrl: 'app/views/advertsMatch/advertsMatch.html',
    controller: 'advertsMatch'
  })
});
