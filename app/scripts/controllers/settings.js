'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('SettingsCtrl', function ($scope, $location) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      $scope.view.title = 'Settings';
      $scope.logOut = function() {
        Parse.User.logOut();
        $location.path('/login');
        location.reload();
      }
    }
    else {
      $location.path('/login');
    }
  });
