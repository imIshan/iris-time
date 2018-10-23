'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

service.get('/service/:location', (req, res, next) => {
    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=YOUR_API_KEY', (err, response) => {
        if (err) {
            console.log('err ', err);
            return res.sendStatus(500)
        }
        if (response.body.error_message) {
            console.log('err ', response.body.status);
            return res.sendStatus(403)
        }
        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X');

        request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location + '&timestamp=' + timestamp + '&key=YOUR_API_KEY', (err, response) => {
            if (err) {
                console.log('err ', err);
                return res.sendStatus(500)
            }
            if (response.body.error_message) {
                console.log('err ', response.body.status);
                return res.sendStatus(403)
            }
            const result = response.body;
            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({ result: timeString })
        });
    })

})

module.exports = service;