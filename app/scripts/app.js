'use strict';

/**
 * @ngdoc overview
 * @name brobetApp
 * @description
 * # brobetApp
 *
 * Main module of the application.
 */
angular
  .module('brobetApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .run(function ($rootScope, $location, $window) {
    if ($location.protocol() !== 'https') {
        $window.location.href = $location.absUrl().replace('http', 'https');
    }
    $(".button-collapse").sideNav();
    Parse.initialize('tz5nZvaRH0LQMJMVQZUb6S02uuXKeWdv4U6hUV4B', 'tiaclWN9uNzykCTyKMPvimvOhFSD6dl5iLf4SmGK');
    var currentUser = Parse.User.current();
    if(currentUser) {
      //Parse.User.enableRevocableSession();
      $rootScope.viewSideBar = true;
      $rootScope.username = currentUser.get("username");
    }
    else {
      $rootScope.viewSideBar = false;
      $location.path( '/login' );
    }
    $rootScope.logOut = function() {
      Parse.User.logOut();
      $rootScope.viewSideBar = false;
      $location.path( '/login' );
    };

    $rootScope.openHref = function(href) {
      $location.path(href);
      $('.button-collapse').sideNav('hide');
    }

    $rootScope.countDowntimer = function(dateTime, id) {
      var end = new Date(dateTime);

      var _second = 1000;
      var _minute = _second * 60;
      var _hour = _minute * 60;
      var _day = _hour * 24;
      var timer;

      function showRemaining() {
          var now = new Date();
          var distance = end - now;
          if (distance < 0) {

              clearInterval(timer);
              $('.' + id).html('EXPIRED!');

              return;
          }
          var days = Math.floor(distance / _day);
          var hours = Math.floor((distance % _day) / _hour);
          var minutes = Math.floor((distance % _hour) / _minute);
          var seconds = Math.floor((distance % _minute) / _second);
          if(!isNaN(days) && !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
            $('.' + id).html(days + 'days ');
            $('.' + id).append(hours + 'hrs ');
            $('.' + id).append(minutes + 'mins ');
            $('.' + id).append(seconds + 'secs');
        }
      }

      timer = setInterval(showRemaining, 1000);
    };
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/championship/:championshipId', {
        templateUrl: 'views/championship.html',
        controller: 'ChampionshipCtrl'
      })
      .when('/championship/:championshipId/:stageId', {
        templateUrl: 'views/championship.html',
        controller: 'ChampionshipCtrl'
      })
      .when('/match/:matchId', {
        templateUrl: 'views/match.html',
        controller: 'MatchCtrl'
      })
      .when('/groups', {
        templateUrl: 'views/groups.html',
        controller: 'GroupsCtrl'
      })
      .when('/groups/create', {
        templateUrl: 'views/createGroup.html',
        controller: 'CreateGroupCtrl'
      })
      .when('/groups/:groupId', {
        templateUrl: 'views/group.html',
        controller: 'GroupCtrl'
      })
      .when('/groups/:groupId/members', {
        templateUrl: 'views/groupMembers.html',
        controller: 'GroupMembersCtrl'
      })
      .when('/groups/:groupId/members/add', {
        templateUrl: 'views/groupMembersAdd.html',
        controller: 'GroupMembersAddCtrl'
      })
      .when('/groups/:groupId/scoreboard', {
        templateUrl: 'views/groupScoreboard.html',
        controller: 'GroupScoreboardCtrl'
      })
      .when('/friends', {
        templateUrl: 'views/friends.html',
        controller: 'FriendsCtrl'
      })
      .when('/friends/add', {
        templateUrl: 'views/addFriend.html',
        controller: 'AddFriendCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/forgottenpassword', {
        templateUrl: 'views/forgottenpassword.html',
        controller: 'ForgottenPasswordCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
