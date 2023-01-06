

let params = new URL(location.href).searchParams;

let season = params.get('s')
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
      season {
        name
      }
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

    document.getElementById('h2').innerHTML = data.topSkillsRankings[0].event.season.name;
    
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