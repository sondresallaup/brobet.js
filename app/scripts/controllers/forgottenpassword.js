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
          Materialize.toast('An email with password reset instructions has been sent', 4000);
        },
        error: function(error) {
          Materialize.toast(error.message, 4000);
        }
      });
    };
  });
