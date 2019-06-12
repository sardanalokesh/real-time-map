const express = require("express");
const randomPoints = require("./pointsGenerator").randomPoints;

var app = require('express')(); 
var http = require('http').Server(app);
var fs = require('fs');
const io = require('socket.io')(http, {
    /*transports: ['websocket']*/
});

const US_GEOJSON_FILE = "geojson/us-states.geojson";
const US_GEOJSON = JSON.parse(fs.readFileSync(US_GEOJSON_FILE, "utf-8"));

// Add headers
app.use(function (req, res, next) {

	/*res.setHeader('Content-Type', 'application/json');*/

    // Website you wish to allow to connect
    /*res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');*/

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.static('app'));

app.get("/randomPoints", (req, res) => {
    const count = req.query.count || 5000;
    randomPoints(count, US_GEOJSON).then(points => {
        sendData(null, points, res);
    }, err => {
        sendData(err, null, res);
    });

});

/*io.on('connection', socket => {
    console.log(`client ${socket.id} connected`);
    io.sockets.clients((err, clients) => {
        if (err) throw err;
        console.log(`total active clients: ${clients.length}`);
    });
    const interval = setInterval( ()=> {
        const count = Math.random()*10000;
        console.log("sending data now");
        console.time("data");
        randomPoints(count, US_GEOJSON).then(points => {
            console.timeEnd("data");
            socket.broadcast.emit("points", points);
        }, err => {
            console.error(err);
        });
    }, 2000);
    socket.on('disconnect', () => {
        clearInterval(interval);
       console.log(`client ${socket.id} disconnected`);
    });
});*/

http.listen(3100, function(){ 
	console.log('listening on *:3100'); 
});

function sendData(err, data, res) {
    if (!err) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(data));
        res.send();
    } else {
        console.log(err);
        res.sendStatus(500);
    }
}