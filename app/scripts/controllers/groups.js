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
      $scope.view.title = 'Groups';
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
      };

      $scope.openCreateGroup = function() {
        $('#createGroupModal').openModal();
      };

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
    };
    }
    else {
      $location.path('/login');
    }
  });
