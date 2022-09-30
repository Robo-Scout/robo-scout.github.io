const h1 = document.getElementById('h1');
let result = null;
const resultsDisplay = document.getElementById('results');
let loaded = false;

const query = decodeURIComponent(window.location.href.split("/").pop());
console.log(query);

h1.innerHTML = query;

//Make http request to server
const Http = new XMLHttpRequest();
const url = `/get/teams?number%5B%5D=${query}&myTeams=false`;
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
  if (!loaded && Http.responseText) {
    loaded = true;
    console.log(Http.responseText);
    result = JSON.parse(Http.responseText);
    let html = '<ul>'
    for(i=0; i<result.data.length; i++){
      html +=`
      <li><a href='/teams/${result.data[i].number}'>${result.data[i].number} - ${result.data[i].team_name}</a><p>Organization: ${result.data[i].organization}<br>Program: ${result.data[i].program.code}<br>Grade: ${result.data[i].grade}<br></p><hr></li>
      `
    }
    if(html === '<ul>'){
      html = `<h2>We were unable to find any teams that match your search.</h2><a href='/home'>Back to Home</a>`
    } else {
      html += '</ul>'
    }
    resultsDisplay.innerHTML = html;
  }
}

//Adds search functionality to nav search bar
const navSearch = document.getElementById('navSearch');

function search(i) {
	let query = i.value;
	if (query.trim().length != 0) {
		window.location.href = '/search/' + encodeURIComponent(query);
	}
}

navSearch.addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		search(navSearch);
	}
});