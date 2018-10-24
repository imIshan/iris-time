'use strict';
const request = require('superagent');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);
server.listen();

server.on('listening', () => {
    console.log(`IRIS-Time is listening on ${server.address().port} in ${service.get('env')}`);
    const announce = () => {
        request.put(`http://localhost:3000/service/time/${server.address().port}`, (err, response) => {
            if(err){
                console.log(err);
                console.log("Error connecting to iris");
                return;
            }
            console.log(response.body);
        })
    }
    announce();
    setInterval(announce, 15 * 1000)
})