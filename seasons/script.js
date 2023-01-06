const query = {
  query: `{
  seasons {
    id
    name
    program {
      id
      abbr
      name
    }
    start
    end
    startYear
    endYear
  }}`
};

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
  let data = xhr.response.data.seasons;
  let html = `<table>
  <tr>
    <th>Season</th>
    <th>Program</th>
  </tr>
  `;
  for(i=0; i<data.length; i++){
    html += `
    <tr>
      <td><a href='/seasons/skills/index.html?s=${data[i].id}'>${data[i].name}</a></td>
      <td>${data[i].program.abbr}</td>
    </tr>
    `
  }
  html += `</table>`
  document.getElementById('results').innerHTML = html;
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