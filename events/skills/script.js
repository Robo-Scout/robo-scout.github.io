let params = new URLSearchParams(document.location.search);
let id = params.get('e');

let query = {
    query: `{
  skillsByEvent(event: ${id}) {
    type
    team {
      id
      number
    }
    score
    rank
    id
    attempts
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