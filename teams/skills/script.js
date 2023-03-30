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
  locationhref='/home'
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

    document.getElementById('h1').innerHTML = data.teamById.number + ' Skills'
    document.title = data.teamById.number + ' Skills | RoboScout'
    
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
      for (i = 0; i < data.skillsByTeam.length; i++) {
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
    document.getElementById('results').innerHTML = "<table id='table'></table>";
    document.getElementById('table').innerHTML = html;
    console.log(html)
  }
xhr.send(JSON.stringify(query));
}

//Adds search functionality to nav search bar
const navSearch = document.getElementById('navSearch');

function search(i) {
	let query = i.value.replace(/[^A-Za-z0-9]/g, "");
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