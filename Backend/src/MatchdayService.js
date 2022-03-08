(window.onload=function() {
  'use strict';

  var searchId;

  function fetchMatchPerId(searchId) {
    fetch('https://www.openligadb.de/api/getmatchdata/' + searchId)
      .then(res => res.json())
  }
  
  function fetchBundesligaSpieltag() {
    fetch('https://www.openligadb.de/api/getmatchdata/bl1/')
      .then(res => res.json())
  }

 
})
