'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $location) {
    if(Parse.User.current()) {
      $location.path("/");
    }
    $scope.formChanged = function() {
      if($scope.username !== undefined && $scope.username !== '' && $scope.password !== undefined && $scope.password !== '') {
        $scope.isDisabled = false;
      } else {
        $scope.isDisabled = true;
      }
    };

    $scope.logIn = function() {
      Parse.User.logIn($scope.username.toLowerCase(), $scope.password, {
        success: function(user) {
          $location.path("/");
          location.reload();
        },
        error: function(user, error) {
          Materialize.toast(error.message, 4000);
        }
      });
    };
  });
