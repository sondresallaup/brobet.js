'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('RegisterCtrl', function ($scope, $location) {
    if(Parse.User.current()) {
      $location.path("/");
    }
    $scope.formChanged = function() {
      if($scope.username !== undefined && $scope.username !== '' && $scope.email !== undefined && $scope.email !== '' && $scope.password !== undefined && $scope.password !== '' && $scope.repeatPassword !== undefined && $scope.repeatPassword !== '' && $scope.terms) {
        if($scope.password === $scope.repeatPassword) {
          $scope.isDisabled = false;
        }
        else {
          // TODO: passwords doesnt match
          $scope.isDisabled = true;
        }
      } else {
        //TODO: inputs must be fillled
        $scope.isDisabled = true;
      }
    };
    $scope.register = function() {
      var user = new Parse.User();
      user.set('username', $scope.username.toLowerCase());
      user.set('password', $scope.password);
      user.set('email', $scope.email);
      user.signUp(null, {
        success: function(user) {
          $location.path("/");
          location.reload();
        },
        error: function(user, error) {
          //TODO: show error message
          alert(error.message)
        }
      });
    };
  });
