let params = new URLSearchParams(document.location.search);
// Get the value of url params
let division = params.get('d');
let event = params.get('e');

if(event && !division){
  window.location.href = 'events/view/index.html?e=' + event;
}
else if(!event || !division){
  location.href='/home'
}

let query = {
    query: `{
  matchesByEvent(division: ${division}, event: ${event}) {
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
    division {
      name
    }
  }
  }`
  };

const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    let html = '';
    if(xhr.response.data.matchesByEvent.length != 0){
    let data = xhr.response.data.matchesByEvent;  
    document.getElementById('h1').innerHTML = data[0].division.name + ' Matches'
    document.title = data[0].division.name + ' Matches | RoboScout'

    //Sort the skills matches putting the most recent first
    data.sort((a, b) => {
      return b.id - a.id;
    });

      html = `
      <tbody>  
        <tr>
          <th>Match</th>
          <th class='red'>Score</th>
          <th class='red'>Teams</th>
          <th class='blue'>Score</th>
          <th class='blue'>Teams</th>
        </tr>
    `;
      for (m = 0; m < data.length; m++) {
        let match = data[m];

        html += `
        <tr>
          <td><a href='/events/divisions/match/index.html?m=${match.id}'>${match.name}</a></td>
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
    } else if (xhr.response.data.matchesByEvent.length == 0) {
      html = '<h2>No Match Data for this Division</h2>'
    }
    document.getElementById('results').innerHTML = "<table id='table'></table>";
    document.getElementById('table').innerHTML = html;
    console.log(html)
  }
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
