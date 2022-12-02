const query = window.location.pathname.split("/").pop();
console.log(query)

//Make http request to server
const Http2 = new XMLHttpRequest();
const url2 = `/get/teams?number%5B%5D=${query}&myTeams=false`;
Http2.open("GET", url2);
Http2.send();
let loaded2 = false;

Http2.onreadystatechange = (e) => {
  if (!loaded2 && Http2.responseText) {
    loaded2 = true;
    console.log(Http2.responseText);
    result = JSON.parse(Http2.responseText);
    getSkills(result.data[0].id)
    document.getElementById('block1table').innerHTML = `
      <tbody>
        <tr>
          <th>Name</th>
          <td>${result.data[0].team_name}</td>
        </tr>
        <tr>
          <th>Organization</th>
          <td>${result.data[0].organization}</td>
        </tr>
        <tr>
          <th>Registered</th>
          <td>${result.data[0].registered ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>${result.data[0].location.city}, ${result.data[0].location.region}</td>
        </tr>
        <tr>
          <th>Program</th>
          <td>${result.data[0].program.name}</td>
        </tr>
        <tr>
          <th>Grade</th>
          <td>${result.data[0].grade}</td>
        </tr>
      </tbody>
    `
  }

  function getSkills(id) {
    //Make http request to server
    const Http = new XMLHttpRequest();
    const url = `/get/teams/${id}/skills?per_page=5`;
    Http.open("GET", url);
    Http.send();
    let loaded = false;

    Http.onreadystatechange = (e) => {
      if (!loaded && Http.responseText) {
        loaded = true;
        console.log(Http.responseText);
        result = JSON.parse(Http.responseText);
        let html = `
      <tbody>
        <tr>
          <th>Event</th>
          <th>Season</th>
          <th>Type</th>
          <th>Score</th>
        </tr>
        `;
        
        for(i=0; i<result.data.length; i++){
          html += `
        <tr>
          <td><a href='/events/${result.data[i].event.id}'>${result.data[i].event.name}</a></td>
          <td><a href='/seasons/${result.data[i].season.id}'>${result.data[i].season.name}</a></td>
          <td>${result.data[i].type}</td>
          <td>${result.data[i].score}</td>
        </tr>`
        }
        html += `</tbody>`
        document.getElementById('block2table').innerHTML = html;
        document.getElementById('block2-main').innerHTML += `<div class='table-label'><a href='${query}/skills'>View All</a></div>`
      }
    }
  }
}

//Nav Search
const navSearch = document.getElementById('navSearch');

navSearch.addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		search(navSearch);
	}
});

function search(i) {
	let query = i.value;
	if (query.trim().length != 0) {
		window.location.href = '/search/' + encodeURIComponent(query);
	}
}