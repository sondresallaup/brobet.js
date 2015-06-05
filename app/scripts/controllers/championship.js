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
          $scope.$apply();

          // Get the matches
          var Match = Parse.Object.extend("Match");
          var matchQuery = new Parse.Query(Match);
          matchQuery.equalTo("championship", championship);
          matchQuery.ascending("time");
          matchQuery.find({
            success: function(results) {
              var matches = results;
              for(var i = 0; i < results.length; i++) {
                var match = new Object();
                var result = results[i];
                match.id = result.id;
                match.homeTeam = result.get("homeTeamStr");
                match.awayTeam = result.get("awayTeamStr");
                match.homeLogo = 'images/team_logos/' + result.get("homeTeam").id + '.GIF';
                match.awayLogo = 'images/team_logos/' + result.get("awayTeam").id + '.GIF';
                match.date = result.get("time");
                matches[i] = match;
              }
              $scope.matches = matches;
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

      $scope.openMatch = function(match) {
        $location.path('/match/' + match);
      }
  });
