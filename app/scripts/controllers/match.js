'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:MatchCtrl
 * @description
 * # MatchCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('MatchCtrl', function ($scope, $routeParams, $location) {
    var currentUser = Parse.User.current();
    if(currentUser) {
      $('html,body').animate({
       scrollTop: $(".card-action").offset().top
      });
      var matchId = $routeParams.matchId;
      var Match = Parse.Object.extend("Match");
      var match = new Match();
      match.id = matchId;
      var matchQuery = new Parse.Query(Match);
      $scope.match = new Object();
      matchQuery.get(matchId, {
        success: function(match) {
          $scope.match.id = match.id;
          $scope.match.homeTeam = match.get("homeTeamStr");
          $scope.match.awayTeam = match.get("awayTeamStr");
          $scope.match.homeLogo = 'images/team_logos/' + match.get("homeTeam").id + '.GIF';
          $scope.match.awayLogo = 'images/team_logos/' + match.get("awayTeam").id + '.GIF';
          $scope.match.date = match.get("time");
          $scope.$apply();
        },
        error: function(object, error) {
          console.log(error.message);
          //TODO: error message
        }
      });

      // Checks if bet exists
      var Bet = Parse.Object.extend("Bet");
      var bet = new Bet();
      var betQuery = new Parse.Query(Bet);
      betQuery.equalTo("match", match);
      betQuery.equalTo("user", Parse.User.current());
      betQuery.find({
        success: function(results) {
          if(results.length > 0) {
            // if bet already exists, use this
            var bet = results[0]
            $scope.userbet = bet;
            $scope.bet.homeScore = bet.get("homeScore");
            $scope.bet.awayScore = bet.get("awayScore");
            $scope.$apply();
          }
          else {
            var bet = new Bet();
            bet.set("user", Parse.User.current());
            bet.set("match", match);
            bet.set("homeScore", parseInt($scope.bet.homeScore));
            bet.set("awayScore", parseInt($scope.bet.awayScore));
            bet.save(null, {
              success: function(bet) {
                $scope.userbet = bet;
              },
              error: function(bet, error) {
                alert(error.message);
              }
            });
          }
        },
        error: function(error) {
          alert(error.message);
        }
      });

      $scope.increaseHome = function() {
        $scope.bet.homeScore++;
        if($scope.userbet != undefined) {
          var userbet = $scope.userbet;
          userbet.set("homeScore", $scope.bet.homeScore);
          userbet.save(null, {
            success: function(userbet) {

            },
            error: function(object, error) {
              alert(error.message);
            }
          });
        }
        else {

        }
      }

      $scope.increaseAway = function() {
        $scope.bet.awayScore++;
        if($scope.userbet != undefined) {
          var userbet = $scope.userbet;
          userbet.set("awayScore", $scope.bet.awayScore);
          userbet.save(null, {
            success: function(userbet) {

            },
            error: function(object, error) {
              alert(error.message);
            }
          });
        }
        else {

        }
      }

      $scope.reset = function() {
        $scope.bet.homeScore = 0;
        $scope.bet.awayScore = 0;
        if($scope.userbet != undefined) {
          var userbet = $scope.userbet;
          userbet.set("homeScore", $scope.bet.homeScore);
          userbet.set("awayScore", $scope.bet.awayScore);
          userbet.save(null, {
            success: function(userbet) {

            },
            error: function(object, error) {
              alert(error.message);
            }
          });
        }
        else {

        }
      }
    }
    else {
      $location.path( '/login' );
    }
  });
