const h1 = document.getElementById('h1');

let season = 0;

let params = new URLSearchParams(document.location.search);
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
var id = params.get('e');

const query = {
  query: `{
  eventById(id: ${id}) {
    id
    location {
      city
      country
      region
      venue
    }
    level
    end
    start
    name
    ongoing
    program {
      abbr
      id
    }
    season {
      name
      id
    }
    divisions {
      name
      id
    }
  }
  teamsByEvent(event: ${id}, limit: 150) {
    id
    number
    teamName
    organization
  }
}`
};


const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
  console.log(xhr.response)
  let data = xhr.response.data;

  h1.innerHTML = data.eventById.name
  document.title = `${data.eventById.name} | RoboScout`
  document.getElementById('block1table').innerHTML = `
      <tbody>
        <tr>
          <th>Program</th>
          <td>${data.eventById.program.abbr}</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>${data.eventById.location.venue}<br>
          ${data.eventById.location.city}, ${data.eventById.location.country}</td>
        </tr>
        <tr>
          <th>Season</th>
          <td><a href='/seasons/skills/index.html?s=${data.eventById.season.id}'>${data.eventById.season.name}</a></td>
        </tr>
        <tr>
          <th>Date</th>
          <td>${new Date(data.eventById.start).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}${data.eventById.start == data.eventById.end ? '' : ' - ' + new Date(data.eventById.end).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</td>
        </tr>
      </tbody>
    `;

  let html = `<tbody><tr><th>#</th><th>Name</th></tr>`
  for(i=0; i<data.eventById.divisions.length; i++){
    html += `<tr><td>${data.eventById.divisions[i].id}</td><td><a href='/events/divisions/index.html?e=${id}&d=${data.eventById.divisions[i].id}'>${data.eventById.divisions[i].name}</a></td></tr>`
  }
  html += `</tbody>`;
  document.getElementById('block2table').innerHTML = html;

  html ='<tbody><tr><th>Number</th><th>Name</th><th>Organization</th></tr>'
  for(i=0; i<data.teamsByEvent.length; i++){
    html += `<tr><td>${data.teamsByEvent[i].number}</td><td><a href='/teams/view/index.html?t=${data.teamsByEvent[i].id}'>${data.teamsByEvent[i].teamName}</a></td><td>${data.teamsByEvent[i].organization}</td></tr>`
  }
  html += `</tbody>`;
  document.getElementById('block3table').innerHTML = html;
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