// angular.module('addstream-app')
//   .directive('googleMap', function () {
//     return {
//       template: '<iframe width="100%" height="350" frameborder="0" style="border:0"></iframe>',
//       restrict: 'EA',
//       scope: {pbcode: '='},
//       link: function postLink(scope, element) {
//         var mapFrame = element.find("iframe");
//           if (scope.pbcode) {
//             mapFrame.attr('src', "https://www.google.com/maps/embed?pb=" + scope.pbcode);
//           }
//           else {
//             mapFrame.attr('src', '');
//           }
//       }
//     };
//   });
