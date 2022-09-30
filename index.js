const http = require('http');
const express = require('express');
const axios = require('axios');
const fs = require('fs');

let teamPage = '';
fs.readFile(__dirname + '/public/teams/view/index.html', 'utf8', function(
  err,
  data
) {
  if (err) throw err;
  teamPage = data;
});

const apiKey = process.env['api_key'];

const app = express();
const httpserver = http.Server(app);

httpserver.listen(3000);

app.get('/', function(req, res) {
  res.redirect('/home');
});

app.get('/search/style.css', function(req, res) {
  res.sendFile(__dirname + '/public/search/style.css');
});
app.get('/search/script.js', function(req, res) {
  res.sendFile(__dirname + '/public/search/script.js');
});

app.get('/search/*', function(req, res) {
  res.sendFile(__dirname + '/public/search/index.html');
});

app.get('/get/*', function(req, response) {
  const query = req.url.slice(5);
  console.log(query);
  let data = null;
  //Make https request to Robot Events Server
  axios
    .get(`https://www.robotevents.com/api/v2/${query}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
    .then(res => {
      console.log(res.data);
      data = res.data;
      response.send(data);
    })
    .catch(error => {
      console.error(error);
    });
});

app.get('/teams/view/script.js', function(req, res) {
  res.sendFile(__dirname + '/public/teams/view/script.js');
});

app.get('/teams/view/style.css', function(req, res) {
  res.sendFile(__dirname + '/public/teams/view/style.css');
});

app.get('/teams/index.html', function(req, res) {
  res.sendFile(__dirname + '/public/teams/index.html');
});

app.get('/teams/script.js', function(req, res) {
  res.sendFile(__dirname + '/public/teams/script.js');
});

app.get('/teams/style.css', function(req, res) {
  res.sendFile(__dirname + '/public/teams/style.css');
});

app.get('/teams', function(req, res) {
  res.sendFile(__dirname + '/public/teams/index.html');
});

app.get('/teams/*', function(req, res) {
  const query = req.url.slice(7);
  res.send(teamPage.replace(/{team-number}/g, query));
});

app.use(express.static('public'));

app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + '/public/error404/index.html');
});

console.log('Server is online!');



/*
let text = '';
axios
  .get(`https://www.robotevents.com/api/v2/teams?per_page=250&page=1`, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })
  .then(res => {
    let data = res.data;
    for (z = 0; z <= data.data.length; z++) {
      text += `\n` + `https://roboscout.org/teams/${data.data[z].number}`;
    }
  })
  .catch(error => {
    console.error(error);
  });
fs.appendFile(__dirname + '/public/sitemap.txt', text, function() {
  console.log('-- Added 250 teams to sitemap.txt')
  console.log(text)
})
*/