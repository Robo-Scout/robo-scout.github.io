const h1 = document.getElementById('h1');

let season = 0;

let params = new URLSearchParams(document.location.search);
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let id = params.get('m');
console.log(id)

const query = {
  query: `{
  matchById(id: ${id}) {
    alliances {
      color
      score
      teams {
        id
        number
        teamName
      }
    }
    event {
      id
      name
    }
    division {
      name
      id
    }
    field
    name
    scheduled
    started
  }
}`
};


const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
  console.log(xhr.response)
  let data = xhr.response.data.matchById;

  h1.innerHTML = data.name
  document.title = `${data.name} | RoboScout`
  document.getElementById('block1table').innerHTML = `
      <tbody>
        <tr>
          <th>Field</th><td>${data.field}</td>
        </tr>
        <tr>
          <th>Scheduled</th><td>${new Date(data.scheduled).toLocaleString()}</td>
        </tr>
        <tr>
          <th>Started</th><td>${new Date(data.started).toLocaleString()}</td>
        </tr>
        <tr>
          <th>Event</th><td><a href='/events/view/index.html?e=${data.event.id}'>${data.event.name}</a></td>
        </tr>
        <tr>
          <th>Divison</th><td><a href='/events/divisions/index.html?e=${data.division.id}'>${data.division.name}</a></td>
        </tr>
      </tbody>
    `;

  let html = `
  <tbody>
    <tr>
      <th>Teams</th>
      <th>Score</th>
    </tr>
  `
  for(i=0; i< data.alliances.length; i++){
    html += `
    <tr>
    <td class='${data.alliances[i].color.toLowerCase()}'>
    `
      for(t=0; t<data.alliances[i].teams.length; t++){
        html += `<a href='/teams/view/index.html?t=${data.alliances[i].teams[t].id}'>${data.alliances[i].teams[t].number}</a>`
        if(t === 0 && data.alliances[i].teams.length > 1){
          html += `, `
        }
      }
      html += `
      </td>
      <td class='${data.alliances[i].color.toLowerCase()}'>${data.alliances[i].score}</td>
      </tr>`
  }
  html += `
  <tbody>
  `
  
  document.getElementById('block2table').innerHTML = html;
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

function load(url) {
  location.href = url + '?t=' + id + '&p=' + program;
  return false;
}


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
Data refreshed in ${hours == 0 ? '' : hours + " hour" + (hours == 1 ? '' : 's') + " and"} ${minutes} minutes.`