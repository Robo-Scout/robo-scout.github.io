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

let params = new URLSearchParams(document.location.search);
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let id = params.get('t');
let program = params.get('p');
if(!program && id){
  window.location.href = '/teams/view/index.html?t=' + id;
}
else if(!id || !program){
  location.href='/home'
}
let seasonsList = seasons[program];
season = params.get('s') || seasonsList[0].id;

for (i = 0; i < seasonsList.length; i++) {
    let option = new Option(seasonsList[i].name, seasonsList[i].id)
    document.getElementById('seasonSelect').add(option, undefined);
  }
document.getElementById('seasonSelect').value = season;

function update(){
  season = document.getElementById('seasonSelect').value;
let query = {
    query: `{
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
  teamById(id: ${id}) {
    number
  }
  }`
  };

const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    let data = xhr.response.data;
    console.log(xhr.response)

    document.getElementById('h1').innerHTML = data.teamById.number + ' Matches'
    document.title = data.teamById.number + ' Matches | RoboScout'
    
    let html = '';

    //Sort the skills matches putting the most recent first
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
      for (m = 0; m < data.matchesByTeam.length; m++) {
        let match = data.matchesByTeam[m];

        html += `
        <tr>
          <td><a href='/events/divisions/match/index.html?m=${match.id}'>${match.name}</a></td>
          <td><a href='/events/index.html?e=${match.event.id}'>${match.event.name}</a></td>
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
    document.getElementById('results').innerHTML = "<table id='table'></table>";
    document.getElementById('table').innerHTML = html;
    console.log(html)
  }
xhr.send(JSON.stringify(query));
}

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

update()