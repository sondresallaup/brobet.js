'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('MainCtrl', function ($scope, $location) {
    $scope.view.title = 'Brobet';
    $scope.openChampionship = function(championship) {
      $location.path('/championship/' + championship);
    }
  });
