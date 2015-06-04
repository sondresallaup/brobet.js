'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:ForgottenPasswordCtrl
 * @description
 * # ForgottenPasswordCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('ForgottenPasswordCtrl', function ($scope, $location) {
    if(Parse.User.current()) {
      $location.path("/");
    }
    $scope.formChanged = function() {
      if($scope.useremail !== undefined && $scope.useremail !== '') {
        $scope.isDisabled = false;
      } else {
        $scope.isDisabled = true;
      }
    };

    $scope.sendReset = function() {
      Parse.User.requestPasswordReset($scope.useremail, {
        success: function() {
        alert("Success!");
        },
        error: function(error) {
          // Show the error message somewhere
        console.error(error);
        }
      });
    };
  });
