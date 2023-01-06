const h1 = document.getElementById('h1');
const seasons = {
  VRC: [
    {
      "id": 173,
      "name": "VRC 2022-2023: Spin Up"
    },
    {
      "id": 154,
      "name": "VRC 2021-2022: Tipping Point"
    },
    {
      "id": 139,
      "name": "VRC 2020-2021: Change Up"
    },
    {
      "id": 130,
      "name": "VRC 2019-2020: Tower Takeover"
    },
    {
      "id": 125,
      "name": "VRC 2018-2019: Turning Point"
    }
  ],
  VEXU: [
    {
      "id": 175,
      "name": "VEXU 2022-2023: Spin Up"
    },
    {
      "id": 156,
      "name": "VEXU 2021-2022: Tipping Point"
    },
    {
      "id": 140,
      "name": "VEXU 2020-2021: Change Up"
    },
    {
      "id": 131,
      "name": "VEXU 2019-2020: Tower Takeover"
    },
    {
      "id": 126,
      "name": "VEXU 2018-2019: Turning Point"
    },
  ],
  VIQC: [
    {
      "id": 174,
      "name": "VIQC 2022-2023: Slapshot"
    },
    {
      "id": 155,
      "name": "VIQC 2021-2022: Pitching In"
    },
    {
      "id": 138,
      "name": "VIQC 2020-2021: Rise Above"
    },
    {
      "id": 129,
      "name": "VIQC 2019-2020: Squared Away"
    },
  ],
  VAIC: [
    {
      "id": 171,
      "name": "VAIC 2021-2022: Tipping Point"
    },
  ]
}

let season = 0;

let params = new URLSearchParams(document.location.search);
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
var id = params.get('t');

const query = {
  query: `{
  teamById(id: ${id}) {
    grade
    number
    organization
    robotName
    teamName
    location {
      city
      country
      region
      coordinates {
        lat
        lon
      }
    }
    program {
      abbr
      id
    }
  }
}`
};

let program = '';

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
  let data = xhr.response.data;
  let seasonsList = seasons[data.teamById.program.abbr];
  program = data.teamById.program.abbr

  season = `${seasonsList[0].id}`;

  for (i = 0; i < seasonsList.length; i++) {
    let option = new Option(seasonsList[i].name, seasonsList[i].id)
    document.getElementById('seasonSelect').add(option, undefined);
  }

  h1.innerHTML = data.teamById.number
  document.title = `${data.teamById.number} | RoboScout`
  document.getElementById('block1table').innerHTML = `
      <tbody>
        <tr>
          <th>Name</th>
          <td>${data.teamById.teamName}</td>
        </tr>
        <tr>
          <th>Organization</th>
          <td>${data.teamById.organization}</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>${data.teamById.location.city}, ${data.teamById.location.region}, ${data.teamById.location.country}</td>
        </tr>
        <tr>
          <th>Program</th>
          <td>${data.teamById.program.abbr}</td>
        </tr>
        <tr>
          <th>Grade</th>
          <td>${data.teamById.grade}</td>
        </tr>
      </tbody>
    `
  update()
};

xhr.send(JSON.stringify(query));

//Adds search functionality to nav search bar
const navSearch = document.getElementById('navSearch');

function search(i) {
  let query = i.value;
  if (query.trim().length != 0) {
    window.location.href = '/search/index.html?i=' + encodeURIComponent(query);
  }
}

navSearch.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    search(navSearch);
  }
});

function update() {
  season = document.getElementById('seasonSelect').value;
  let query2 = {
    query: `{
  skillsByTeam(season: ${season}, team: ${id}) {
    attempts
    score
    rank
    id
    type
    event {
      name
      id
    }
  }
  matchesByTeam(season: ${season}, team: ${id}) {
    alliances {
      color
      score
      teams {
        id
        teamName
        number
      }
    }
    field
    id
    matchNum
    name
    round
    scored
    started
    scheduled
    event {
      id
      name
      start
    }
  }
  eventsByAttendingTeam(season: ${season}, team: ${id}) {
    name
    id
    start
  }
  awardsByTeam(season: ${season}, team: ${id}) {
    title
    id
    event {
      name
      id
    }
  }
  rankingsByTeam(season: ${season}, team: ${id}) {
    id
    ap
    averagePoints
    highScore
    losses
    rank
    sp
    ties
    totalPoints
    wins
    wp
  }
}`
  };

  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    let data = xhr.response.data;
    let html = '';

    //Sort the skills matches putting the most recent first
    data.skillsByTeam.sort((a, b) => {
      return b.id - a.id;
    });

    if (data.skillsByTeam.length > 0) {
      html = `
      <tbody>  
        <tr>
          <th>Score</th>
          <th>Type</th>
          <th>Attempts</th>
          <th>Rank</th>
          <th>Event</th>
        </tr>
    `;
      for (i = 0; i < (data.skillsByTeam.length < 5 ? data.skillsByTeam.length : 5); i++) {
        let skillsMatch = data.skillsByTeam[i];
        html += `
      <tr>
        <td>${skillsMatch.score}</td>
        <td>${skillsMatch.type.toLowerCase().charAt(0).toUpperCase() + skillsMatch.type.slice(1)}</td>
        <td>${skillsMatch.attempts}</td>
        <td>${skillsMatch.rank}</td>
        <td style='overflow: elipse'><a href='/events/view/index.html?e=${skillsMatch.event.id}'>${skillsMatch.event.name}</a></td>
      </tr>
      `
      }
      html += '</tbody>';
    } else if (data.skillsByTeam.length == 0) {
      html = '<h2>No Skills Data for this Season</h2>'
    }
    document.getElementById('block2-main').innerHTML = "<table id='block2table'></table>";
    if (data.skillsByTeam.length > 5) {
      document.getElementById('block2-main').innerHTML += `<a style='display: block; text-align: center; margin-bottom: 10px;' href='/teams/skills/index.html?t=${id}&p=${program}&s=${season}'>View All</a>`;
    }
    document.getElementById('block2table').innerHTML = html;

    //Matches
    //Sort the matches putting the most recent first
    data.matchesByTeam.sort((a, b) => {
      return b.id - a.id;
    });

    if (data.matchesByTeam.length > 0) {
      html = `
      <tbody>  
        <tr>
          <th>Match</th>
          <th>Event</th>
          <th class='red'>Score</th>
          <th class='red'>Teams</th>
          <th class='blue'>Score</th>
          <th class='blue'>Teams</th>
        </tr>
    `;
      for (m = 0; m < (data.matchesByTeam.length < 5 ? data.matchesByTeam.length : 5); m++) {
        let match = data.matchesByTeam[m];

        html += `
        <tr>
          <td><a href='/events/divisions/match/index.html?m=${match.id}'>${match.name}</a></td>
          <td><a href='/events/view/index.html?e=${match.event.id}'>${match.event.name}</a></td>
          <td class='red'>${match.alliances[0].score}</td>
          <td class='red'>
        `;

        for (t = 0; t < match.alliances[0].teams.length; t++) {

          if (t > 0) {
            html += ', '
          }

          html += `<a href='/teams/view/index.html?t=${match.alliances[0].teams[t].id}'>${match.alliances[0].teams[t].number}</a>`
        }

        html += `</td>
          <td class='blue'>${match.alliances[1].score}</td>
          <td class='blue'>`;

        for (t = 0; t < match.alliances[1].teams.length; t++) {

          if (t > 0) {
            html += ', '
          }
          html += `<a href='/teams/view/index.html?t=${match.alliances[1].teams[t].id}'>${match.alliances[1].teams[t].number}</a>`

        }

        html += `</td></tr>`
      }
      html += '</tbody>'
    } else if (data.matchesByTeam.length == 0) {
      html = '<h2>No Match Data for this Season</h2>'
    }
    document.getElementById('block3-main').innerHTML = "<table id='block3table'></table>";
    if (data.matchesByTeam.length > 5) {
      document.getElementById('block3-main').innerHTML += `<a href='/teams/matches/index.html?t=${id}&p=${program}&s=${season}' style='display: block; text-align: center; margin-bottom: 10px;'>View All</a>`;
    }
    document.getElementById('block3table').innerHTML = html;

    //Awards
    //Sort the awards putting the most recent first
    data.awardsByTeam.sort((a, b) => {
      let aDate = new Date(a.event.start);
      let bDate = new Date(b.event.start);
      return bDate - aDate;
    });
    html = '';
    if (data.awardsByTeam.length > 0) {
      html = `
      <tbody>  
        <tr>
          <th>Title</th>
          <th>Event</th>
        </tr>
    `;

      for (a = 0; a < data.awardsByTeam.length; a++) {
        let award = data.awardsByTeam[a];
        console.log(award)
        html += `
        <tr>
          <td>${award.title}</td>
          <td><a href='/events/view/index.html?e=${award.event.id}'>${award.event.name}</a></td>
        </tr>
        `;
      }
      html += '</tbody>'
    } else if (data.awardsByTeam.length == 0) {
      html = '<h2>No Award Data for this Season</h2>'
    }
    document.getElementById('block4-main').innerHTML = "<table id='block4table'></table>";
    document.getElementById('block4table').innerHTML = html;

    //events
    //Sort the events putting the most recent first
    data.eventsByAttendingTeam.sort((a, b) => {
      let aDate = new Date(a.start);
      let bDate = new Date(b.start);
      return bDate - aDate;
    });
    html = '';
    if (data.eventsByAttendingTeam.length > 0) {
      html = `
      <tbody>  
        <tr>
          <th>Event</th>
          <th>Date</th>
        </tr>
    `;

      for (e = 0; e < data.eventsByAttendingTeam.length; e++) {
        let event = data.eventsByAttendingTeam[e];
        html += `
        <tr>
          <td><a href='/events/view/index.html?e=${event.id}'>${event.name}</a></td>
          <td>${new Date(event.start).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</td>
        </tr>
        `;
      }
      html += '</tbody>'
    } else if (data.eventsByAttendingTeam.length == 0) {
      html = '<h2>No Award Data for this Season</h2>'
    }
    document.getElementById('block5-main').innerHTML = "<table id='block5table'></table>";
    document.getElementById('block5table').innerHTML = html;

    //Stats
    html = '';
    let stats = data.rankingsByTeam;
    if (data.rankingsByTeam.length > 0) {
      html = `
      <tr><th>Average Points per Match</th><td>${Math.round((stats.reduce((total, next) => total + next.averagePoints, 0) / stats.length) * 10) / 10}</td></tr>
      <tr><th>High Score</th><td>${Math.max.apply(Math, stats.map(o => o.highScore))}</td></tr>
      <tr><th>% Won</th><td>${Math.round((stats.reduce((total, next) => total + next.wins, 0) / (stats.reduce((total, next) => total + next.wins, 0) + stats.reduce((total, next) => total + next.losses, 0))) * 1000) / 10}%</td></tr>
      <tr><th>Wins</th><td>${stats.reduce((total, next) => total + next.wins, 0)}</td></tr>
      <tr><th>Losses</th><td>${stats.reduce((total, next) => total + next.losses, 0)}</td></tr>
      <tr><th>Ties</th><td>${stats.reduce((total, next) => total + next.ties, 0)}</td></tr>
      <tr><th>Matches Played</th><td>${stats.reduce((total, next) => total + next.ties, 0) + stats.reduce((total, next) => total + next.wins, 0) + stats.reduce((total, next) => total + next.losses, 0)}</td></tr>
      `
    } else if (data.rankingsByTeam.length == 0) {
      html = '<h2>No Stats Data for this Season</h2>'
    }
    document.getElementById('block6-main').innerHTML = "<table id='block6table'></table>";
    document.getElementById('block6table').innerHTML = html;
  };

  xhr.send(JSON.stringify(query2));
}

function load(url) {
  location.href = url + '?t=' + id + '&p=' + program;
  return false;
}

// Display when the data was last scraped and when the data will next be scraped based on the times listed at theredalliance.xyz
let dateObject = new Date();
let dates = [dateObject.setUTCHours(5, 0, 0, 0), dateObject.setUTCHours(10, 0, 0, 0), dateObject.setUTCHours(15, 0, 0, 0), dateObject.setUTCHours(20, 0, 0, 0)]
let nextDate = null;

// Get the current date and time in UTC
let now = new Date();
now.setUTCDate(now.getUTCDate());
now.setUTCHours(now.getUTCHours());
now.setUTCMinutes(now.getUTCMinutes());
now.setUTCSeconds(now.getUTCSeconds());

// Loop through the dates array
for (let date of dates) {
  // Convert the date from a number to a Date object
  date = new Date(date);

  // If the date is later than the current date, log it and break out of the loop
  if (date > now) {
    nextDate = date;
    break;
  }
}
if (!nextDate) {
  nextDate = new Date(dates[0] + 86400000).getTime();
}
let timeDifference = nextDate - now;
let hours = Math.floor(timeDifference / 3600000);
let minutes = Math.round((timeDifference % 3600000) / 60000);
let hoursPast = Math.floor((300 - ((hours * 60) + minutes))/60)
let minutesPast = 60 - minutes;
document.getElementById('timeTillRefresh').innerHTML = `Last Updated ${hoursPast == 0 ? '' : hoursPast + " hour" + (hoursPast == 1 ? '' : 's') + " and"} ${minutesPast} minutes ago.
Data refreshed in ${hours == 0 ? '' : hours + " hour" + (hours == 1 ? '' : 's') + " and"} ${minutes} minutes.`;
