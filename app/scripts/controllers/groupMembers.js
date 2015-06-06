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
      $scope.view.title = 'Group members';
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

      $scope.openAddMember = function() {
        $('#addMemberModal').openModal();
      };

      $scope.formChanged = function() {
        if($scope.friend.username !== undefined && $scope.friend.username !== '') {
          $scope.isDisabled = false;
        } else {
          $scope.isDisabled = true;
        }
      };

      $scope.addMember = function() {
        if($scope.friend.username !== undefined && $scope.friend.username !== '') {
          var groupId = $routeParams.groupId;
          var Group = Parse.Object.extend("Group");
          var group = new Group();
          group.id = groupId;

          var userQuery = new Parse.Query(Parse.User);
          userQuery.equalTo("username", $scope.friend.username.toLowerCase());
          userQuery.notEqualTo("username", Parse.User.current());
          userQuery.find({
            success: function(users) {
              if(users.length > 0) {
              // Check if already friends
              var Friendship = Parse.Object.extend("Friendship");
              var friendshipFromQuery = new Parse.Query(Friendship);
              friendshipFromQuery.equalTo("fromUser", users[0]);
              friendshipFromQuery.equalTo("toUser", Parse.User.current());
              var friendshipToQuery = new Parse.Query(Friendship);
              friendshipToQuery.equalTo("fromUser", Parse.User.current());
              friendshipToQuery.equalTo("toUser", users[0]);

              var friendshipQuery = new Parse.Query.or(friendshipFromQuery, friendshipToQuery);
              friendshipQuery.find({
                success: function(friendships) {
                  if(friendships.length > 0) {
                    var friendship = friendships[0];
                    var friend = friendship.get("fromUser");
                    if(friend.id === currentUser.id) {
                      friend = friendship.get("toUser");
                    }
                    // Check if member of this group
                    var GroupMembership = Parse.Object.extend("GroupMembership");
                    var membershipQuery = new Parse.Query(GroupMembership);
                    membershipQuery.equalTo("user", friend);
                    membershipQuery.equalTo("group", group);
                    membershipQuery.find({
                      success: function(results) {
                        if(results.length < 1) {
                          // Save user to membership
                          var newMembership = new GroupMembership();
                          newMembership.set("user", friend);
                          newMembership.set("group", group);
                          newMembership.set("role", "BASIC");
                          newMembership.save(null, {
                            success: function(newMembership) {
                              alert($scope.friend.username + " added to the group ;-)");
                              $scope.$apply();
                            },
                            error: function(object, error) {
                              console.error(error);
                            }
                          });
                        }
                        else {
                          alert("User is already member of this group");
                        }
                      },
                      error: function(error) {
                        console.error(error);
                      }
                    });
                  }
                },
                error: function(error) {
                  console.error(error);
                }
              });
            }
            else {
              alert("User doesn't exist");
            }
            },
            error: function(error) {
              console.error(error);
            }
          });
        } else {
          alert();
        }
      };

      $scope.openGroup = function(group) {
        $location.path('/groups/' + group);
      }
    }
    else {
      $location.path('/login');
    }
  });
