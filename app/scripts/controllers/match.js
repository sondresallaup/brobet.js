'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:MatchCtrl
 * @description
 * # MatchCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('MatchCtrl', function ($scope, $rootScope, $routeParams, $location) {
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
          Materialize.toast(error.message, 4000);
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
            $scope.loading = false;
            $scope.$apply();
          }
          else {
            $scope.createBetIfNotExist();
          }
        },
        error: function(error) {
          Materialize.toast(error.message, 4000);
        }
      });

      $scope.increaseHome = function() {
        if(!$rootScope.hasMatchExpired($scope.match.date)) {
          $scope.bet.homeScore++;
          if($scope.userbet != undefined) {
            var userbet = $scope.userbet;
            userbet.set("homeScore", $scope.bet.homeScore);
            userbet.save(null, {
              success: function(userbet) {

              },
              error: function(object, error) {
                Materialize.toast(error.message, 4000);
              }
            });
          }
          else {

          }
        }
        else {
            Materialize.toast("It's to late to bet on this match :(", 4000);
        }
      }

      $scope.increaseAway = function() {
        if(!$rootScope.hasMatchExpired($scope.match.date)) {
        $scope.bet.awayScore++;
        if($scope.userbet != undefined) {
          var userbet = $scope.userbet;
          userbet.set("awayScore", $scope.bet.awayScore);
          userbet.save(null, {
            success: function(userbet) {

            },
            error: function(object, error) {
              Materialize.toast(error.message, 4000);
            }
          });
        }
        else {

        }
      }
      else {
        Materialize.toast("It's to late to bet on this match :(", 4000);
      }
      }

      $scope.reset = function() {
        if(!$rootScope.hasMatchExpired($scope.match.date)) {
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
              console.log(error.message);
            }
          });
        }
        else {

        }
      }
      else {
        Materialize.toast("It's to late to bet on this match :(", 4000);
      }
      }

      $scope.createBetIfNotExist = function() {
        var timer;

        function createBetIfNotExist() {
          if($scope.userbet === undefined && !$rootScope.hasMatchExpired($scope.match.date)) {
            $scope.loading = true;
            $scope.$apply();
            var bet = new Bet();
            bet.set("user", Parse.User.current());
            bet.set("match", match);
            bet.set("homeScore", parseInt($scope.bet.homeScore));
            bet.set("awayScore", parseInt($scope.bet.awayScore));
            bet.save(null, {
              success: function(bet) {
                clearInterval(timer);
                $scope.userbet = bet;
                $scope.loading = false;
                $scope.$apply();
              },
              error: function(bet, error) {
                Materialize.toast(error.message, 4000);
              }
            });
          }
          else {
            $scope.loading = false;
            $scope.$apply();
          }
        }
        timer = setInterval(createBetIfNotExist, 1000);
      }
    }
    else {
      $location.path( '/login' );
    }
  });
