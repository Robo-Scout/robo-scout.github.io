66666666666666666666666666  const h1 = document.getElementById('h1');
const resultsDisplay = document.getElementById('results');

let params = new URLSearchParams(document.location.search);
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let query = params.get('i');
console.log(query)

h1.innerHTML = query;

//Check for search type
let type = params.get('type')
if(type == 'events'){
  document.getElementById('eventsBtn').disabled = true;

  const yourQuery = {
    query: `{
  searchEvents(query: "${query}") {
    data {
      id
      name
      sku
    }
    meta {
      results
    }
  }
}`
};

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function () {
  
  let data = xhr.response.data.searchEvents.data;
  console.log(data);

let html = `<h2>${xhr.response.data.searchEvents.meta.results} Results</h2><ul>`
  
  if(data.length !== 0){
  for(i=0; i<data.length; i++){
    html += `
    <li>
    <h2><a href='/events/view/index.html?e=${data[i].id}'>${data[i].name}</a></h2>
    <p>${data[i].sku}</p>
    <hr>
    </li>
    `
  }
  
  html += '</ul>'
    
  } else {
    html = '<h2>We were unable to find any results for your search</h2>';
  }
  
  resultsDisplay.innerHTML = html;
  
};

xhr.send(JSON.stringify(yourQuery));
  
} else {
  type = 'teams';
document.getElementById('teamsBtn').disabled = true;
  
  const yourQuery = {
    query: `{
  searchTeams(query: "${query}") {
    data {
      id
      name
      number
      organization
    }
    meta {
      results
    }
  }
}`
};

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://api.theredalliance.xyz/v1/query');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function () {
  
  let data = xhr.response.data.searchTeams.data;
  console.log(data);

let html = `<h2>${xhr.response.data.searchTeams.meta.results} Results</h2><ul>`
  
  if(data.length !== 0){
  for(i=0; i<data.length; i++){
    html += `
    <li>
    <h2><a href='/teams/view/index.html?t=${data[i].id}'>${data[i].number} - ${data[i].name}</a></h2>
    <p>${data[i].organization}</p>
    <hr>
    </li>
    `
  }
  
  html += '</ul>'
    
  } else {
    html = '<h2>We were unable to find any results for your search</h2>';
  }
  
  resultsDisplay.innerHTML = html;
  
};

xhr.send(JSON.stringify(yourQuery));
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