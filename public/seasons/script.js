let results = null;
let loaded = false;
const resultsDisplay = document.getElementById('results');
let fader = null;
loadSeasons(1)

function loadSeasons(page) {
  if(fader) fader.style.opacity = 0.5;
  
  loaded = false;
  //Make http request to server
  const Http = new XMLHttpRequest();
  const url = `/get/seasons?page=${page}`;
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    if (!loaded && Http.responseText) {
      loaded = true;
      console.log(Http.responseText);
      try {
        result = JSON.parse(Http.responseText);
      } catch {
        console.error('Invalid JSON Data. Retrying HTTP request...');
        loadSeasons(page);
        return;
      }
      let html = `<div class='pageCntrl'><button onclick='loadSeasons(1)' class='arrow' ${1 == page ? 'disabled' : 'enabled'}>«</button>`
        for(i=(page - 2); i<(page+3); i++){
          if(i >= 1 && i <= result.meta.last_page){
            html += `<button class='page' onclick='loadSeasons(${i})' ${i == page ? 'disabled' : 'enabled'}>${i}</button>`
          }
        }
        html +=`<button onclick=loadSeasons(${result.meta.last_page}) class='arrow' style='border-right: none;' ${result.meta.last_page == page ? 'disabled' : 'enabled'}>»</button></div>
    <table>
      <tr>
        <th>Name</th>
        <th>Program</th>
        <th>Dates</th>
      </tr>
    `;
      for (i = 0; i < result.data.length; i++) {
        html += `<tr>
      <td>${result.data[i].name}</td>
      <td>${result.data[i].program.code}</td>
      <td>${new Date(result.data[i].start).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"})} - ${new Date(result.data[i].end).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"})}</td>
      </tr>`
      }
      html += `</table>`
      resultsDisplay.innerHTML = html;
      teamId = result.id;
      if(fader){
        fader.style.opacity = 0;
      } else {
        fader = document.getElementById('fader');
        fader.style.transition = '1s';
      }
    }
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