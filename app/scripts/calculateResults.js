var pointsCorrectHXA = 1;
var pointsCorrectResult = 3;
var matchId = 'EC4WILfB2i';


Parse.initialize('tz5nZvaRH0LQMJMVQZUb6S02uuXKeWdv4U6hUV4B', 'tiaclWN9uNzykCTyKMPvimvOhFSD6dl5iLf4SmGK');

var Match = Parse.Object.extend('Match');
var finishedMatchesQuery = new Parse.Query(Match);
//finishedMatchesQuery.equalTo('status', 'finished');
finishedMatchesQuery.equalTo('objectId', matchId);
// find all finished matches
finishedMatchesQuery.find({
  success: function(finishedMatches) {
    for(var i = 0; i < finishedMatches.length; i++) {
      var match = finishedMatches[i];
      var actualResult = new Object();
      actualResult.home = match.get('homeScore');
      actualResult.away = match.get('awayScore');
      // loops through all bets for this match
      var Bet = Parse.Object.extend('Bet');
      var betQuery = new Parse.Query(Bet);
      betQuery.equalTo('match', match);
      betQuery.find({
        success: function(bets) {
          for(var y = 0; y < bets.length; y++) {
            var bet = bets[y];
            var betResult = new Object();
            betResult.home = bet.get('homeScore');
            betResult.away = bet.get('awayScore');
            if(bet.get('scoreHXA') === undefined) {
              // calculate HXA score
              if(hasCorrectHXA(actualResult, betResult)) {
                bet.set('scoreHXA', pointsCorrectHXA);
              }
              else {
                bet.set('scoreHXA', 0);
              }
            }
            if(bet.get('scoreResult') === undefined) {
              // calculate result score
              if(hasCorrectResult(actualResult, betResult)) {
                bet.set('scoreResult', pointsCorrectResult);
              }
              else {
                  bet.set('scoreResult', 0);
              }
            }
            bet.save(null, {
              success: function(bet) {
                console.log(bet);
              },
              error: function(bet, error) {
                console.error(error);
              }
            });


            //todo: remember to set status to 'calcultated' or something
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

var hasCorrectResult = function(actualResult, betResult) {
  if(actualResult.home === betResult.home) {
    if(actualResult.away === betResult.away) {
      return true;
    }
  }
  return false;
}

var hasCorrectHXA = function(actualResult, betResult) {
  var actualHXA;
  var betHXA;

  // Check if draw
  if(actualResult.home === actualResult.away) {
    actualHXA = 'X';
  }
  else if(actualResult.home > actualResult.away) {
    actualHXA = 'H';
  }
  else if(actualResult.home < actualResult.away) {
    actualHXA = 'A';
  }

  if(betResult.home === betResult.away) {
    betHXA = 'X';
  }
  else if(betResult.home > betResult.away) {
    betHXA = 'H';
  }
  else if(betResult.home < betResult.away) {
    betHXA = 'A';
  }

  return betHXA === actualHXA;
}
