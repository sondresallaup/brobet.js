'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:CreateGroupCtrl
 * @description
 * # CreateGroupCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('CreateGroupCtrl', function ($scope, $location) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      $scope.formChanged = function() {
        if($scope.group.name !== undefined && $scope.group.name !== '') {
          $scope.isDisabled = false;
        } else {
          $scope.isDisabled = true;
        }
      };

      $scope.createGroup = function() {
        if($scope.group.name !== undefined && $scope.group.name !== '') {
          var Group = Parse.Object.extend("Group");
          var group = new Group();
          group.set("name", $scope.group.name);
          group.save(null, {
            success: function(group){
              var GroupMembership = Parse.Object.extend("GroupMembership");
              var groupMembership = new GroupMembership();
              groupMembership.set("user", currentUser);
              groupMembership.set("group", group);
              groupMembership.set("role", "ADMIN");
              groupMembership.save(null, {
                success: function(groupMembership) {
                  alert($scope.group.name + " has been created ;-)");
                  $location.path('/groups/' + groupMembership.id);
                },
                error: function(object, error) {
                  console.error(error);
                }
              });
            },
            error: function(object, error) {
              console.error(error);
            }
          });
      }
      }
    }
    else {
      $location.path('/login');
    }
  });
