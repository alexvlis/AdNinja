'use strict';

angular.module('adstream-app')

.controller('Homepage', ['$scope', '$state', function($scope, $state) {
    $scope.clicked = function() {
      $state.go('test');
  }
}
]);
