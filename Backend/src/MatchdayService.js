(window.onload=function() {
  'use strict';

  var bundesligaMatches = [];
  var searchId;
  

  document.getElementById("test").addEventListener('click', function(e) {
    e.preventDefault();
    fetchBundesligaSpieltag();
  });
  
  document.getElementById("test2").addEventListener('submit', function(e) {
    e.preventDefault();
    searchId = document.getElementById("search").value;
    fetchMatchPerId(searchId);
  });

  function fetchMatchPerId(searchId) {
    fetch('https://www.openligadb.de/api/getmatchdata/' + searchId)
      .then(res => res.json())
      .then(res => new match(res))
      //.then(res => console.log(res.Team1.TeamName, res.Team2.TeamName, res.Group.GroupName))
  }
  
  function fetchBundesligaSpieltag() {
    fetch('https://www.openligadb.de/api/getmatchdata/bl1/')
      .then(res => res.json())
      .then(res => {
        for(let i=0; i < res.size; i++) {
          let m = new match(res[i]);
          bundesligaMatches.push[m];
        }
      })
      .catch(error => {
        console.log(error);
      })
    };

  class match {
    constructor(matchData) {
      let _self = this;
      this.matchData = matchData;
      var matchStates = [];
      matchStates.push(_self.createBundesligaMatchObject());
      console.log("test");

      this.createBundesligaMatchObject = function () {
        let matchDatas = {};
        matchDatas["Hometeam"] = _self.matchData.Match.Team1.TeamName;
        matchDatas["Guestteam"] = _self.matchData.Match.Team2.TeamName;
        console.log(matchDatas["Guestteam"], matchDatas["Hometeam"]);
        return matchDatas;
      };
    }
  }

})
