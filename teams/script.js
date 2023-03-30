const seasons = [
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
    },
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
    {
      "id": 171,
      "name": "VAIC 2021-2022: Tipping Point"
    },
  ];

let params = new URL(location.href).searchParams;

season = params.get('s') || seasons[0].id;

for (i = 0; i < seasons.length; i++) {
    let option = new Option(seasons[i].name, seasons[i].id)
    document.getElementById('seasonSelect').add(option, undefined);
  }
document.getElementById('seasonSelect').value = season;

function update(){
  season = document.getElementById('seasonSelect').value;
let query = {
    query: `{
  topSkillsRankings(season: ${season}, limit: 150) {
    combinedScore
    team {
      number
      id
    }
    rank
    event {
      id
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
    let data = xhr.response.data;
    console.log(xhr.response)
    
    let html = '';

      html = `
      <tbody>  
        <tr>
          <th>Rank</th>
          <th>Score</th>
          <th>Team</th>
          <th>Event</th>
        </tr>
    `;
      for (i = 0; i < data.topSkillsRankings.length; i++) {
        let skillsMatch = data.topSkillsRankings[i];
        html += `
      <tr>
        <td>${skillsMatch.rank}</td>
        <td>${skillsMatch.combinedScore}</td>
        <td><a href='/teams/view/index.html?t=${skillsMatch.team.id}'>${skillsMatch.team.number}</a></td>
        <td style='overflow: elipse'><a href='/events/view/index.html?e=${skillsMatch.event.id}'>${skillsMatch.event.name}</a></td>
      </tr>
      `
      }
      html += '</tbody>';
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