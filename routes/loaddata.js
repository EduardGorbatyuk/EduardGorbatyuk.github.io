/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const models = require('../models');
const config = require('../config');

router.post('/games', async (req, res) => {
    const date = req.body.date;
    var games = null;
    var coll = await models.User.find({_id: req.session.userId});
    fetch('https://apifootball.com/api/?action=get_events&from='+ date +'&to=' + date + '&APIkey=' + config.API_KEY + '')
    .then(resp => resp.json())
    .then((out) => {
        if(out.error != "404") {
            games = out.sort(
                function(a, b) {          
                if (a.country_name === b.country_name) {
                    return a.league_name > b.league_name ? 1 : -1;
                }
                return a.country_name > b.country_name ? 1 : -1;
                });
            if(coll.length != "") { 
                for(let i = 0; i < coll[0].leagues_id.length; i++) {
                    if((games.find(x => x.league_id === coll[0].leagues_id[i])) != undefined) {
                        games.find(x => x.league_id === coll[0].leagues_id[i]).isLeague = true;
                    }       
                }
            }
            res.json({
                ok: true,
                games
            });
        }
    })
    .catch(err => { throw err });
});

router.post('/livegames', async (req, res) => {
    const today = req.body.today;
    var lives = null;
    var col = await models.User.find({_id: req.session.userId});
    fetch('https://apifootball.com/api/?action=get_events&from=2019-06-06&to=' + today + '&match_live=1&APIkey=' + config.API_KEY + '')
    .then(resp => resp.json())
    .then((out) => {
        if(out.error != "404") {
            lives = out.sort(
                function(a, b) {          
                if (a.country_name === b.country_name) {
                    return a.league_name > b.league_name ? 1 : -1;
                }
                return a.country_name > b.country_name ? 1 : -1;
                });
            if(col.length != "") { 
                for(let i = 0; i < col[0].leagues_id.length; i++) {
                    if((lives.find(x => x.league_id === col[0].leagues_id[i])) != undefined) {
                        lives.find(x => x.league_id === col[0].leagues_id[i]).isLeague = true;
                    }       
                }
            }
            res.json({
                ok: true,
                lives
            });
        }
    })
    .catch(err => { throw err });
});

router.post('/leagues', async (req, res) => {
    var leagues = null; 
    var col = await models.User.find({_id: req.session.userId});  
    fetch('https://apifootball.com/api/?action=get_leagues&APIkey=' + config.API_KEY + '')
    .then(resp => resp.json())
    .then((out) => {
        leagues = out.sort(
            function(a, b) {          
                if (a.country_name < b.country_name) return -1;
                if (a.country_name > b.country_name) return 1;
                return 0;
            });
        if(col.length != "") { 
            res.json({
                ok: true,
                leagues,
                col
            });
        } else {
            res.json({
                ok: true,
                leagues
            });
        }
    })
    .catch(err => { throw err });
});

router.post('/tables', (req, res) => {
    var tables = null; 
    var id = req.body.id;  
    fetch('https://apifootball.com/api/?action=get_standings&league_id=' + id + '&APIkey=' + config.API_KEY + '')
    .then(resp => resp.json())
    .then((out) => {
        if(out.error != "404") {
            tables = out.sort(
                function(a, b) {          
                    return (a.overall_league_position - b.overall_league_position);                    
                });
            res.json({
                ok: true,
                tables
            });                
        }                      
    })
    .catch(err => { throw err });
});

module.exports = router;