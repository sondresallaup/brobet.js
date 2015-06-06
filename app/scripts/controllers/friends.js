'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:FriendsCtrl
 * @description
 * # FriendsCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('FriendsCtrl', function ($scope, $location) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      $scope.view.title = 'Friends';
      var Friendship = Parse.Object.extend("Friendship");
      var friendshipFromQuery = new Parse.Query(Friendship);
      friendshipFromQuery.equalTo("fromUser", currentUser);
      var friendshipToQuery = new Parse.Query(Friendship);
      friendshipToQuery.equalTo("toUser", currentUser);

      var friendshipQuery = Parse.Query.or(friendshipFromQuery, friendshipToQuery);
      friendshipQuery.find({
        success: function(friendships) {
          $scope.friends = [];
          for(var i = 0; i < friendships.length; i++) {
            var friendship = friendships[i];
            var friend = friendship.get("fromUser");
            if(friend.id === currentUser.id) {
              friend = friendship.get("toUser");
            }
            friend.fetch({
              success: function(friend) {
                $scope.friends.push(friend.get("username"));
                $scope.$apply();
              }
            });
          }
        },
        error: function(error) {
          console.error(console.error);
        }
      });

      $scope.openAddFriend = function() {
        $('#addFriendModal').openModal();
      };

      $scope.formChanged = function() {
        if($scope.friend.username !== undefined && $scope.friend.username !== '') {
          $scope.isDisabled = false;
        } else {
          $scope.isDisabled = true;
        }
      };

      $scope.addFriend = function() {
        if($scope.friend.username !== undefined && $scope.friend.username !== '') {
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
              friendshipFromQuery.find({
                success: function(friendships) {
                  if(friendships.length > 0) {
                    Materialize.toast('You are already friends!', 4000)
                  }
                  else { // Checks the reversed friendship
                    var friendshipToQuery = new Parse.Query(Friendship);
                    friendshipToQuery.equalTo("fromUser", Parse.User.current());
                    friendshipToQuery.equalTo("toUser", users[0]);
                    friendshipToQuery.find({
                      success: function(friendships) {
                        if(friendships.length > 0) {
                          Materialize.toast('You are already friends!', 4000);
                        }
                        else {
                          // Add friend to db
                          var friendship = new Friendship();
                          friendship.set("fromUser", Parse.User.current());
                          friendship.set("toUser", users[0]);
                          friendship.save(null, {
                            success: function(friendship) {
                              Materialize.toast($scope.friend.username + ' added ;-)', 4000);
                              $location.path( '/friends' );
                            },
                            error: function(object, error) {
                              Materialize.toast(error.message, 4000);
                            }
                          });
                        }
                      },
                      error: function(error) {
                        Materialize.toast(error.message, 4000);
                      }
                    });
                  }
                },
                error: function(error) {
                  Materialize.toast(error.message, 4000);
                }
              });
            }
            else {
              Materialize.toast('User does not exist', 4000);
            }
            },
            error: function(error) {
              Materialize.toast(error.message, 4000);
            }
          });
        } else {
          Materialize.toast('You must provide a username', 4000);
        }
      };
    }
    else {
      $location.path( '/login' );
    }
  });
