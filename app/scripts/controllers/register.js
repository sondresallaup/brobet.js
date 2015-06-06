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
          $scope.isDisabled = true;
        }
      } else {
        $scope.isDisabled = true;
      }
    };

    $scope.passwordInputsChange = function() {
      $scope.formChanged();
      if($scope.password === $scope.repeatPassword) {
        $scope.passwordsDoesntMatch = false;
      }
      else {
        $scope.passwordsDoesntMatch = true;
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
          Materialize.toast(error.message, 4000);
        }
      });
    };

    $scope.openTermsModal = function() {
      $('#termsModal').openModal();
    }

    $scope.termsAgreeClick = function() {
      $scope.terms = true;
      $scope.formChanged();
      $('#termsModal').closeModal();
    }
  });
