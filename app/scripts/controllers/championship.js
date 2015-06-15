'use strict';

/**
 * @ngdoc function
 * @name brobetApp.controller:ChampionshipCtrl
 * @description
 * # ChampionshipCtrl
 * Controller of the brobetApp
 */
angular.module('brobetApp')
  .controller('ChampionshipCtrl', function ($scope, $routeParams, $location) {
      var championshipId = $routeParams.championshipId;
      var Championship = Parse.Object.extend("Championship");
      var championshipQuery = new Parse.Query(Championship);
      $scope.championship = new Object();
      championshipQuery.get(championshipId, {
        success: function(championship) {
          $scope.view.title = championship.get("name");
          $scope.title.href = '#/championship/' + championship.id;
          $scope.$apply();

          // Get stages
          var Stage = Parse.Object.extend("Stage");
          var stageQuery = new Parse.Query(Stage);
          stageQuery.equalTo("championship", championship);
          stageQuery.ascending("rank");
          stageQuery.find({
            success: function(results) {
              $scope.stages = [];
              for(var i = 0; i < results.length; i++) {
                var result = results[i];
                var stage = new Object();
                stage.id = result.id;
                if(result.get('active')) {
                  stage.active = 'active';
                }
                stage.name = result.get('name');
                $scope.stages.push(stage);
                $scope.$apply();
              }
            }
          });

          // Get the matches
          var Match = Parse.Object.extend("Match");
          var matchQuery = new Parse.Query(Match);
          matchQuery.equalTo("championship", championship);
          matchQuery.ascending("time");
          matchQuery.find({
            success: function(results) {
              var matches = results;
              $scope.matches = [];
              for(var i = 0; i < results.length; i++) {
                var match = new Object();
                var result = results[i];
                match.id = result.id;
                match.homeTeam = result.get("homeTeamStr");
                match.awayTeam = result.get("awayTeamStr");
                match.homeLogo = 'images/team_logos/' + result.get("homeTeam").id + '.GIF';
                match.awayLogo = 'images/team_logos/' + result.get("awayTeam").id + '.GIF';
                match.isPlayed = result.get('homeScore') > -1;
                match.homeScore = result.get('homeScore');
                match.awayScore = result.get('awayScore');
                match.date = result.get("time");
                matches[i] = match;
                $scope.matches.push(match);
                $scope.$apply();
              }
              $scope.loading = false;
              $scope.$apply();
            },
            error: function(error) {
              // TODO: error handling
              console.log(error.message);
            }
          });
        },
        error: function(object, error) {
          console.log(error.message);
          //TODO: error message
        }
      });

      $scope.openStage = function(stage) {
        $location.path('/championship/' + championshipId + '/' + stage);
      }

      $scope.openMatch = function(match) {
        $location.path('/match/' + match);
      }

      $scope.getBetFromDb = function(matchId) {
        $('#bet' + matchId).html('Loading bet');
        var Match = Parse.Object.extend("Match");
        var match = new Match();
        match.id = matchId;
        // Get bet
        var Bet = Parse.Object.extend("Bet");
        var bet = new Bet();
        var betQuery = new Parse.Query(Bet);
        betQuery.equalTo("match", match);
        betQuery.equalTo("user", Parse.User.current());
        betQuery.find({
          success: function(results) {
            if(results.length > 0) {
              //Mark bet green as placed
              if($('#match' + matchId).hasClass('bet')) {
                $('#match' + matchId).removeClass('blue-grey');
                $('#match' + matchId).addClass('green');
              }

              var bet = results[0]
              var homeScore = bet.get("homeScore");
              var awayScore = bet.get("awayScore");
              $('#bet' + matchId).html('<b>Your bet:</b><br/>');
              $('#bet' + matchId).append(homeScore + ' - ');
              $('#bet' + matchId).append(awayScore)
              var scoreHXA = bet.get('scoreHXA');
              var scoreResult = bet.get('scoreResult');
              var scoreTotal = scoreHXA + scoreResult;
              var hasReceivedScore = scoreHXA !== undefined;;
              if(hasReceivedScore) {
                $('#bet' + matchId).append('<br/>Points: ' + scoreTotal);
              }
            }
            else {
              $('#bet' + matchId).html('');
            }
          },
          error: function(error) {
            console.log(error.message);
          }
        });
        // End get bet
      }
  });

  $(document).ready(function(){
    $('ul.tabs').tabs();
  });
