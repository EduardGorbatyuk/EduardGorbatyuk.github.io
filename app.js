/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//const fetch = require('node-fetch');

const config = require('./config');
const routes = require('./routes');

// database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });

// express
const app = express();

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

var request = require('request');
request('https://apifootball.com/api/?action=get_leagues&APIkey=004b26f0bdc9085ae7d6916dc3aa7b7a5c81af51dde4720ab74ea13f1759806a', function (error, response, body) {
  if (!error && response.statusCode == 200) {
     leagues = JSON.parse(body).sort(function(obj1, obj2) {
        if (obj1.league_name < obj2.league_name) return -1;
        if (obj1.league_name > obj2.league_name) return 1;
        return 0;
    });
  }
})

request('https://apifootball.com/api/?action=get_countries&APIkey=004b26f0bdc9085ae7d6916dc3aa7b7a5c81af51dde4720ab74ea13f1759806a', function (error, response, body) {
  if (!error && response.statusCode == 200) {
     cont = JSON.parse(body).sort(function(obj1, obj2) {
        if (obj1.country_name < obj2.country_name) return -1;
        if (obj1.country_name > obj2.country_name) return 1;
        return 0;
    });
  }
})

request('https://apifootball.com/api/?action=get_events&from=2019-05-08&to=2019-05-08&APIkey=004b26f0bdc9085ae7d6916dc3aa7b7a5c81af51dde4720ab74ea13f1759806a', function (error, response, body) {
  if (!error && response.statusCode == 200) {
     games = JSON.parse(body).sort(
      function(a, b) {          
         if (a.country_name === b.country_name) {
            return a.league_name > b.league_name ? 1 : -1;
         }
         return a.country_name > b.country_name ? 1 : -1;
      });
      var temp = games[0].league_name;
      for(var i = 0; i < games.length; i++) {
        if((i == 0 ) || (temp != games[i].league_name)) {
           country_league.push(games[i]);     
           count_match.push(i);
           temp = games[i].league_name;
        }
  }
  count_match.push(games.length);
}
})

request('https://apifootball.com/api/?action=get_events&from=2019-05-08&to=2019-05-08&match_live=1&APIkey=004b26f0bdc9085ae7d6916dc3aa7b7a5c81af51dde4720ab74ea13f1759806a', function (error, response, body) {
  if (!error && response.statusCode == 200) {
     games = JSON.parse(body).sort(
      function(a, b) {          
         if (a.country_name === b.country_name) {
            return a.league_name > b.league_name ? 1 : -1;
         }
         return a.country_name > b.country_name ? 1 : -1;
      });
      var temp = games[0].league_name;
      for(var i = 0; i < games.length; i++) {
        if((i == 0 ) || (temp != games[i].league_name)) {
           live_con.push(games[i]);     
           live_matches.push(i);
           temp = games[i].league_name;
        }
  }
  live_matches.push(games.length);
}
})

request('https://apifootball.com/api/?action=get_standings&league_id=62&APIkey=004b26f0bdc9085ae7d6916dc3aa7b7a5c81af51dde4720ab74ea13f1759806a', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    ttable = JSON.parse(body).sort(function(a,b){return a.overall_league_position-b.overall_league_position;});
  }
})

var cont = null;
var leagues = null;
let games = null;
var ttable = null;
var country_league = [];
var count_match = [];
var live_con = [];
var live_matches = [];

// routers
app.get('/', (req, res) => {
  const id = req.session.userId;
  const email = req.session.userEmail;
  res.render('index', {
    user: {
      id,
      email,
    },
    data: {
      leagues,
      cont,
      games,
      ttable,
      country_league,
      count_match,
      live_con,
      live_matches 
    }
  });
});
app.use('/api/auth', routes.auth);

//var url = 'https://apifootball.com/api/?action=get_leagues&APIkey=004b26f0bdc9085ae7d6916dc3aa7b7a5c81af51dde4720ab74ea13f1759806a';

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

app.listen(config.PORT, () =>
  console.log(`Example app listening on port ${config.PORT}!`)
);