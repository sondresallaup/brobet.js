'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:GroupsCtrl
 * @description
 * # GroupsCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('GroupsCtrl', function ($scope, $location) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      var GroupMembership = Parse.Object.extend("GroupMembership");
      var membershipQuery = new Parse.Query(GroupMembership);
      membershipQuery.equalTo("user", currentUser);
      membershipQuery.find({
        success: function(memberships) {
          $scope.groups = [];
          for(var i = 0; i < memberships.length; i++) {
            var membership = memberships[i];
            var group = membership.get("group");
            group.fetch({
              success: function(result) {
                var group = new Object();
                group.id = result.id;
                group.name = result.get("name");
                $scope.groups.push(group);
                $scope.$apply();
            },
            error: function(object, error) {
              console.error(error);
            }
            });
          }
        },
        error: function(error) {
          console.error(error);
        }
      });

      $scope.openGroup = function(group) {
        $location.path('/groups/' + group);
      }
    }
    else {
      $location.path('/login');
    }
  });
