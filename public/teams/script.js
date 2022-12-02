let results = null;
let loaded = false;
const resultsDisplay = document.getElementById('results');
let fader = null;
loadTeams(1)

function loadTeams(page) {
  if(fader){
    fader.style.opacity = 0.5;
    fader.style.height = 'calc(85% - 222px)';
  }
  
  loaded = false;
  //Make http request to server
  const Http = new XMLHttpRequest();
  const url = `/get/teams?page=${page}`;
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
        loadTeams(page);
        return;
      }
      let html = `
      <div class='dropdown'>
        <button id='filter' onclick="dropdown(document.getElementById('filterContent'))" class='dropbtn'>
          <img src='/images/filter.png' class='dropbtn'>
          <p class='dropbtn'>▼</p>
        </button>
        <div id="filterContent" class="dropdown-content">
        <button class='filterDropbtn' onclick="filterOpen('program')">Program<p id='program-caret'>▶</p></button>
        <div id='program-content' class='filterDrop-content'>
        <button>VRC</button>
        <button>VIQC</button>
        </div>
        <button class='filterDropbtn' onclick="filterOpen('grade')">Grade<p id='grade-caret'>▶</p></button>
        <div id='grade-content' class='filterDrop-content'></div>
        </div>
      </div>
      <div class='pageCntrl'><button onclick='loadTeams(1)' class='arrow' ${1 == page ? 'disabled' : 'enabled'}>«</button>`
        for(i=(page - 2); i<(page+3); i++){
          if(i >= 1 && i <= result.meta.last_page){
            html += `<button class='page' onclick='loadTeams(${i})' ${i == page ? 'disabled' : 'enabled'}>${i}</button>`
          }
        }
        html +=`<button onclick=loadTeams(${result.meta.last_page}) class='arrow' style='border-right: none;' ${result.meta.last_page == page ? 'disabled' : 'enabled'}>»</button></div>
    <table>
      <tr>
        <th>Number</th>
        <th>Name</th>
        <th>Program</th>
        <th>Registered</th>
      </tr>
    `;
      for (i = 0; i < result.data.length; i++) {
        html += `<tr>
      <td>${result.data[i].number}</td>
      <td><a href='/teams/${result.data[i].number}'>${result.data[i].team_name}</a></td>
      <td>${result.data[i].program.code}</td>
      <td>${result.data[i].registered ? 'Yes' : 'No'}</td>
      </tr>`
      }
      html += `</table>`
      resultsDisplay.innerHTML = html;
      teamId = result.id;
      if(fader){
        fader.style.opacity = 0;
        setTimeout(function(){fader.style.height = '0px';}, 1000)
      } else {
        fader = document.getElementById('fader');
        fader.style.transition = 'opacity 1s';
        fader.style.height = '0px';
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

function dropdown(element) {
  element.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function filterOpen(name){
  document.getElementById(name + '-content').classList.toggle('show');
  let caret = document.getElementById(name + '-caret');
  if(caret.innerHTML == '▶'){
    caret.innerHTML - '▼';
  } else {
    caret.innerHTML = '▶';
  }
}