'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:GroupMembersAddCtrl
 * @description
 * # GroupMembersAddCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('GroupMembersAddCtrl', function ($scope, $location, $routeParams) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      $scope.formChanged = function() {
        if($scope.friend.username !== undefined && $scope.friend.username !== '') {
          $scope.isDisabled = false;
        } else {
          $scope.isDisabled = true;
        }
      };

      $scope.addFriend = function() {
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
          // TODO: error message
        }
      };
    }
    else {
      $location.path( '/login' );
    }
  });
