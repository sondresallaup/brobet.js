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
    }
    else {
      $location.path( '/login' );
    }
  });
