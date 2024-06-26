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
	socket.on('requestHighscores', async () => {
		var highscores = await db.getHighscores();
		socket.emit('highscoresReturn', highscores);
	});
	socket.on('checkHighscores', async () => {
		var highscores = await db.getHighscores();
		socket.emit('checkHighscoresReturn', highscores);
	});
	socket.on('newHighscore', async (data) => {
		 db.addHighscore({ time: data.time, name: data.name, correct: data.correct, nofq: data.nofq});
	});
})

server.listen(3000, () => {
	console.log('Server active.')
});
