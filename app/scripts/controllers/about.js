'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
