var express = require('express');
var http = require('http');
var socket = require('socket.io');
var hbs = require('hbs');
var join = require('join');
var seo = require("./seo.json");
var db = require("./sqlite.js");
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
var server = http.createServer(app);
const io = socket(server, {
	connectionStateRecovery: {}
});
app.get('/', (req, res) => {
	var params = req.query.raw ? {} : { seo: seo };
		res.render('index', params)
})

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('a user diconnected');
	});
	socket.on('message', (data) => {
		console.log('message: ' + data.message);
		socket.emit('serverMessage', {message: data.message});
	})
})

server.listen(3000, () => {
	console.log('Server active.')
});