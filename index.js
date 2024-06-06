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
var io = socket(server, {
	connectionStateRecovery: {}
});
app.get('/', async (req, res) => {
	var params = req.query.raw ? {} : { seo: seo };
		var counter = await db.getCounter();
		if (counter) {
			params.counter = counter.map((Counter) => Counter.counter);
		}
		res.render('index', params)
})

io.on('connection', async (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('a user diconnected');
	});
	socket.on('play', async () => {
		db.increaseCounter();
		var counter = await db.getCounter();
		if (counter) {
			counter = counter.map((Counter) => Counter.counter);
		}
		io.emit('counterUpdate', {newValue: counter});
	});
	socket.on('message', (result) => {
		console.log(result.message);
	})
})

server.listen(3000, () => {
	console.log('Server active.')
});