'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:GroupCtrl
 * @description
 * # GroupCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('GroupCtrl', function ($scope, $routeParams, $location) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      $scope.view.title = "Group";
      var groupId = $routeParams.groupId;
      var Group = Parse.Object.extend("Group");
      var groupQuery = new Parse.Query(Group);
      groupQuery.get(groupId, {
        success: function(object) {
          var group = new Object();
          group.id = object.id;
          group.name = object.get("name");

          group.openGroupMembers = function() {
            $location.path( '/groups/' + $scope.group.id + '/members' );
          };

          group.openScoreboard = function() {
            $location.path( '/groups/' + $scope.group.id + '/scoreboard' );
          };

          $scope.group = group;
          $scope.$apply();
        },
        error: function(object, error) {
          console.error(error);
        }
      });
    }

    else {
      $location.path( '/login' );
    }
  });
