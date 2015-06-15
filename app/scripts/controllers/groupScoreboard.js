'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:GroupScoreboardCtrl
 * @description
 * # GroupScoreboardCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('GroupScoreboardCtrl', function ($scope, $location, $routeParams) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      $scope.view.title = 'Group scoreboard';
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

            var member = membership.get("user");
            member.fetch({
              success: function(memberResult) {
                var member = new Object();
                member.id = memberResult.id;
                member.username = memberResult.get("username");
                member.role = membership.get("role");

                // get the score
                var Championship = Parse.Object.extend('Championship');
                var championship = new Championship();
                championship.id = 'VyBG4nr5k5';
                var Score = Parse.Object.extend('Score');
                var scoreQuery = new Parse.Query(Score);
                scoreQuery.equalTo('user', memberResult);
                scoreQuery.equalTo('championship', championship);
                scoreQuery.first({
                  success: function(score) {
                    member.score = score.get('score');
                    member.openUserScores = function() {
                      $location.path('/user/' + member.id + '/' + championship.id);
                    }
                    $scope.members.push(member);
                    $scope.$apply();
                  },
                  error: function(error) {
                    console.error(error);
                  }
                });
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
