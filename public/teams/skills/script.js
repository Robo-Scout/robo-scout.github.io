let querys = window.location.pathname.split("/");
let team = querys[querys.length - 2];
let team_id = null;

//Make http request to server
const Http = new XMLHttpRequest();
const url = `/get/teams?number%5B%5D=${team}&myTeams=false`;
Http.open("GET", url);
Http.send();
let loaded2 = false;

Http.onreadystatechange = (e) => {
    if (!loaded2 && Http.responseText) {
        team_id = JSON.parse(Http.responseText).data[0].id;
        loadSkills(1)
    }
}

let results = null;
let loaded = false;
const resultsDisplay = document.getElementById('results');
let fader = null;

function loadSkills(page) {
    if (fader) fader.style.opacity = 0.5;

    loaded = false;
    //Make http request to server
    const Http = new XMLHttpRequest();
    const url = `/get/teams/${team_id}/skills?page=${page}&per_page=20`;
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
                loadEvents(page);
                return;
            }
            let html = `<div class='pageCntrl'><button onclick='loadSkills(1)' class='arrow' ${1 == page ? 'disabled' : 'enabled'}>«</button>`
            for (i = (page - 2); i < (page + 3); i++) {
                if (i >= 1 && i <= result.meta.last_page) {
                    html += `<button class='page' onclick='loadSkills(${i})' ${i == page ? 'disabled' : 'enabled'}>${i}</button>`
                }
            }
            html += `<button onclick=loadSkills(${result.meta.last_page}) class='arrow' style='border-right: none;' ${result.meta.last_page == page ? 'disabled' : 'enabled'}>»</button></div>
    <table>
      <tr>
        <th>Event</th>
        <th>Season</th>
        <th>Type</th>
        <th>Score</th>
      </tr>
    `;
            for (i = 0; i < result.data.length; i++) {
                html += `<tr>
                <td><a href='/events/${result.data[i].event.id}'>${result.data[i].event.name}</a></td>
                <td><a href='/seasons/${result.data[i].season.id}'>${result.data[i].season.name}</a></td>
                <td>${result.data[i].type}</td>
                <td>${result.data[i].score}</td>
      </tr>`
            }
            html += `</table>`
            resultsDisplay.innerHTML = html;
            if (fader) {
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

navSearch.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        search(navSearch);
    }
});