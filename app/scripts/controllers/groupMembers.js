'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:GroupMembersCtrl
 * @description
 * # GroupMembersCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('GroupMembersCtrl', function ($scope, $location, $routeParams) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      var groupId = $routeParams.groupId;
      var Group = Parse.Object.extend("Group");
      var group = new Group();
      group.id = groupId;

      var GroupMembership = Parse.Object.extend("GroupMembership");
      var membershipQuery = new Parse.Query(GroupMembership);
      membershipQuery.equalTo("group", group);
      membershipQuery.find({
        success: function(memberships) {
          $scope.members = [];
          for(var i = 0; i < memberships.length; i++) {
            var membership = memberships[i];
            $scope.membership = membership;
            $scope.membership.openAddMember = function() {
              $location.path( '/groups/' + group.id + '/members/add' );
            }

            var member = membership.get("user");
            member.fetch({
              success: function(result) {
                var member = new Object();
                member.id = result.id;
                member.username = result.get("username");
                member.role = membership.get("role");
                $scope.members.push(member);
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
