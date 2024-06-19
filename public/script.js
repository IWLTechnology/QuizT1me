var socket = io();
var nofq = 10;
var timeouts = {
	popup: null,
	timer: null,
	bgmusic: null
};
var devel = [];
var sfx = 1;
var music = 1;
var currentQuestion = 0;
var timer = 0;
var timerActive = 1;
var numcorrect = 0;
var questions = [
	"Which is the most populated country in the world?",
	"Which continent is France located in?",
	"Any number (x) to the power of zero is:",
	"One to the power of any number (x) is:",
	"What is scientific notation for water?",
	"Which planet or star is at the centre of our solar system?",
	"What shape is the Earth?",
	"In English, what is a homophone?",
	"Which word is spelt incorrectly?",
	"Which is not a programming language?",
	"Which assortment is not an input on a computer?",
	"Which of the following is spelt incorrectly?",
	"Which is not an animal found wild in Australia?",
	"Which animal species is classified as endangered?",
	"Which animal of the following is an amphibian?",
	"What is 1+1?",
	"What is the square root of 4?",
	"What was another name for the Black Death?",
	"Which of the following HTML tags is used for a hyperlink?",
	"Which of the following stores does not sell fruit?",
];
var answers = [
	["China", "India", "US", "Russia"],
	["Europe", "Asia", "North America", "Africa"],
	["0", "2", "1", "x"],
	["0", "1", "x", "2"],
	["HO", "HO2", "H2O2", "H2O"],
	["The Sun", "Earth", "Jupiter", "Venus"],
	["Flat", "A donut", "A sphere", "A square"],
	[
		"A word that sounds the same as another word but is spelt differently.",
		"A word that sounds the same as another word and is spelt the same.",
		"A word that does not sound the same as another word but is spelt the same.",
		"A word that does not sound the same as another word and is not spelt the same.",
	],
	[
		"Receive",
		"Antidisestablishmentarianism",
		"Pneumonoultramicroscopicsilicovolcanoconiosis",
		"Reccommend",
	],
	["HTML", "XML", "KJTML", "CSS"],
	["Mouse", "USB Drive", "Keyboard", "Touchscreen"],
	[
		"Conscentious",
		"Gobbledegook",
		"Entrepreneur",
		"Antidisestablishmentarianism",
	],
	["Dingo", "Fox", "Porcupine", "Snake"],
	["Dingo", "Red Fox", "Humpback Whale", "Blue Whale"],
	["Frog", "Monkey", "Wolf", "Fox"],
	["37", "1", "2", "11"],
	["0", "1", "-2", "2"],
	[
		"The Bubonic Plague",
		"The Bulonic Plague",
		"The White Plague",
		"The Europe Plague",
	],
	["p", "a", "h1", "link"],
	["Coles", "Spudshed", "Woolworths", "Jaycar"],
];
var correctAnswers = [
	"01000010",
	"01000001",
	"01000011",
	"01000010",
	"01000100",
	"01000001",
	"01000011",
	"01000001",
	"01000100",
	"01000011",
	"01000010",
	"01000001",
	"01000011",
	"01000100",
	"01000001",
	"01000011",
	"01000100",
	"01000001",
	"01000010",
	"01000100",
];

var chosenQuestions = [];

/*form.addEventListener('submit', (event) => {
	event.preventDefault();
	if(input.value){
		socket.emit('message', {
			message: input.value
		});
		input.value = '';
	}
})*/

socket.on("counterUpdate", (data) => {
	document.getElementById("counter").innerHTML = data.newValue;
});

socket.on("highscoresReturn", (data) => {
	document.getElementById('highscoreTable').innerHTML = `<tr><th>#of questions:</th><th>Current record holder:</th><th>Number of correct:</th><th>Time taken:</th></tr>`;
	for(var i = 0; i < data.length; i++){
		var time = (parseInt(data[i].time)/10).toString()
		var percent = (
			(parseInt(data[i].correct) / parseInt(data[i].nofq)) *
			100
		).toFixed(2);
		document.getElementById('highscoreTable').innerHTML += `<tr><td>${data[i].nofq}</td><td>${data[i].name}</td><td>${data[i].correct} out of ${data[i].nofq} (${percent}%)</td><td>${time} seconds</td></tr>`;
	}
	$("#highscores-div").dialog({
		dialogClass: "no-close",
		closeOnEscape: false,
		modal: true,
		height: "auto",
		width: "auto",
	});
});
function preloadSound() {
	if (!createjs.Sound.initializeDefaultPlugins()) {
	} else {
		try {
			createjs.Sound.addEventListener("fileload", playSound);
			createjs.Sound.alternateExtensions = ["mp3", "wav", "ogg"];
			createjs.Sound.registerSounds(
				[{ id: "w0", src: "/buzzer-4-183895.mp3" },
				{ id: "w1", src: "/buzzer-15-187758.mp3" },
				{ id: "w2", src: "/error-8-206492.mp3" },
				{ id: "w3", src: "/Player.Die2.wav" },
				{ id: "w4", src: "/Player.Die22.wav" },
				 { id: "w5", src: "/sm/09_-_Super_Mario_Bros._-_NES_-_Killed.ogg" },
				{ id: "c0", src: "/correct-156911.mp3" },
				 { id: "c1", src: "/cute-level-up-2-189851.mp3" },
				{ id: "c2", src: "/cute-level-up-3-189853.mp3" },
				 { id: "qs", src: "/lets-start-the-quiz-b-39670.mp3" },
				 { id: "nh0", src: "/Ultimate-Victory-WST010901.wav" },
				 { id: "nh1", src: "/mixkit-medieval-show-fanfare-announcement-226.wav" }
				],
				"./sound",
			);
		} catch (err) {}
	}
}

function playSound(ev){
	devel.push("SoundJS:" + ev);
}

function playBgMusic(){
	if(music == 1){
		var rand = 'bg' + Math.floor(Math.random() * 18);
		document.getElementById(rand).volume = 0.2;
		document.getElementById(rand).currentTime = 0.000000000000000000000000000000000000000000000000000000000000000;
		document.getElementById(rand).play();
		timeouts.bgmusic = setTimeout(function(){
			playBgMusic();
		}, (document.getElementById(rand).duration*1000))
	}
}

function stopBgMusic(){
	window.clearTimeout(timeouts.bgmusic);
	for(var i = 0; i < 18; i++){
		document.getElementById("bg" + i).pause();
		document.getElementById("bg" + i).currentTime = 0.000000000000000000000000000000000000000000000000000000000000000;
	}
}

function init() {
	document.getElementById('loading').style.display = "none";
	document.getElementById('navbar').style.display = "block";
	document.title = "Home" + " |" + document.title.split("|")[1];
	var buttons = document.getElementsByClassName('questionButton');
		for(var i = 0; i < buttons.length; i++){
			buttons[i].style.height = (window.innerHeight - 300) / 2 + "px";
		}
	window.innerHeight
	preloadSound()
	document.getElementById("home").style.display = "block";
}

function play() {
	document.getElementById("settings").style.display = "none";
	document.getElementById("home").style.display = "none";
	document.getElementById("beforeplay").style.display = "block";
	document.getElementById("nav1").innerHTML = "Play";
	document.getElementById("nav2").innerHTML = "Back";
	document.getElementById("nav2btn").setAttribute("onclick", "exitPlay()");
	document.getElementById("nav3").innerHTML = "Play";
	document.getElementById("nav3btn").setAttribute("onclick", "startPlay()");
	document.title = "Play" + " |" + document.title.split("|")[1];
}

function highscores() {
	socket.emit("requestHighscores", {});
}

function exitPlay() {
	document.getElementById("home").style.display = "block";
	document.getElementById("beforeplay").style.display = "none";
	document.getElementById("nav1").innerHTML = "Home";
	document.getElementById("nav3").innerHTML = "Settings";
	document.getElementById("nav3btn").setAttribute("onclick", "settings(0)");
	document.getElementById("nav2").innerHTML = "Play";
	document.getElementById("nav2btn").setAttribute("onclick", "play()");
	document.title = "Home" + " |" + document.title.split("|")[1];
}

function changeQuestions() {
	$("#nofq-div").dialog({
		dialogClass: "no-close",
		closeOnEscape: false,
		modal: true,
		height: "auto",
		width: "auto",
	});
}

function closeHighscores(){
	$("#highscores-div").dialog("close");
}

function closenofq(num) {
	switch (num) {
		case 0:
			$("#nofq-div").dialog("close");
			nofq = 10;
			popup("warning", "The number of questions was reset to 10.");
			break;
		case 1:
			$("#nofq-div").dialog("close");
			if (
				parseInt(document.getElementById("nofq-input").value) &&
				parseInt(document.getElementById("nofq-input").value) > 9 &&
				parseInt(document.getElementById("nofq-input").value) < 21
			) {
				nofq = parseInt(document.getElementById("nofq-input").value);
				popup("good", "The number of questions has been successfully changed!");
			} else {
				nofq = 10;
				popup(
					"warning",
					"An incorrect value was inputted, the number of questions has been set to 10.",
				);
			}
			break;
	}
}

function popup(status, message) {
	window.clearTimeout(timeouts.popup);
	var popup = document.getElementById("popup");
	var box = document.getElementById("popupBox");
	popup.innerHTML = message;
	box.className = status + " w3-center alfa-slab-one";
	box.style.display = "block";
	timeouts.popup = setTimeout(function () {
		box.style.opacity = 1;
		timeouts.popup = setTimeout(function () {
			document.getElementById("popupBox").style.opacity = 0;
			setTimeout(function () {
				document.getElementById("popupBox").style.display = "none";
			}, 1000);
		}, 5000);
	}, 10);
}

function soundPlay(toPlay){
		if(document.getElementById('playingSound').innerHTML == '1'){
			queue('add', toPlay);
		}else{
			var instance = createjs.Sound.play(toPlay);
			playInit();
			instance.on('complete', playFin);
		}
	}

function playFin(){
		document.getElementById('playingSound').innerHTML = '0';
		queue('next', '');
	}

function playInit(){
		document.getElementById('playingSound').innerHTML = '1'; 
}

function queue(m, v){
		switch(m){
			case 'next':
				var y = document.getElementById('soundQueue').innerHTML.split(',');
				y.shift();
				document.getElementById('soundQueue').innerHTML = y;
				queue('play', '');
				break;
			case 'clear':
				document.getElementById('soundQueue').innerHTML = '';
				break;
			case 'add':
				var x = document.getElementById('soundQueue').innerHTML.split(',')
				x.push(v);
				document.getElementById('soundQueue').innerHTML = x;
				break;
			case 'play': 
				if(document.getElementById('playingSound').innerHTML == '0'){
					if(document.getElementById('soundQueue').innerHTML.split(',')[0] != ''){
	soundPlay(document.getElementById('soundQueue').innerHTML.split(',')[0]);
				}else{

				}
				break;
		}
		}
	}

function afterTitle() {
	playBgMusic();
	document.getElementById("nav2").innerHTML = "";
	document.getElementById("nav2btn").setAttribute("onclick", "");
	document.getElementById("nav3").innerHTML = "Quit";
	document.getElementById("nav3btn").setAttribute("onclick", "window.location.reload()");
	chosenQuestions = [];
	var random;
	numcorrect = 0;
	for (var i = 0; i > -1; i++) {
		random = Math.floor(Math.random() * questions.length);
		if (chosenQuestions.length == nofq) {
			break;
		} else {
			if (chosenQuestions.find((element) => element == random) == undefined) {
				chosenQuestions.push(random);
			} else {
			}
		}
	}
	document.getElementById("title").style.display = "none";
	document.getElementById("questionName").innerHTML =
		questions[chosenQuestions[0]];
	document.getElementById("answer1").innerHTML = answers[chosenQuestions[0]][0];
	document.getElementById("answer2").innerHTML = answers[chosenQuestions[0]][1];
	document.getElementById("answer3").innerHTML = answers[chosenQuestions[0]][2];
	document.getElementById("answer4").innerHTML = answers[chosenQuestions[0]][3];
	document.getElementById("nav2").innerHTML = "Question 1 of " + nofq + "";
	document.getElementById("question").style.display = "block";
	document.body.addEventListener("keyup", keyPress);
	timerUse(0);
}

function startPlay() {

	if(sfx == 1){
		soundPlay('qs');
	}
	document.getElementById("beforeplay").style.display = "none";
	document.getElementById("title").style.display = "block";
	document.getElementById("nav2").innerHTML = "";
	document.getElementById("nav2btn").setAttribute("onclick", "");
	document.getElementById("nav3").innerHTML = "Quit";
	document.getElementById("nav3btn").setAttribute("onclick", "window.location.reload()");
	setTimeout(function(){
		document.getElementById('progress').style.width = '5%';
	}, 250);
	setTimeout(function(){
		document.getElementById('progress').style.width = '10%';
	}, 500);
	setTimeout(function(){
		document.getElementById('progress').style.width = '15%';
	}, 750);
	setTimeout(function(){
		document.getElementById('progress').style.width = '20%';
	}, 1000);
	setTimeout(function(){
		document.getElementById('progress').style.width = '25%';
	}, 1250);
	setTimeout(function(){
		document.getElementById('progress').style.width = '30%';
	}, 1500);
	setTimeout(function(){
		document.getElementById('progress').style.width = '35%';
	}, 1750);
	setTimeout(function(){
		document.getElementById('progress').style.width = '40%';
	}, 2000);
	setTimeout(function(){
		document.getElementById('progress').style.width = '45%';
	}, 2250);
	setTimeout(function(){
		document.getElementById('progress').style.width = '50%';
	}, 2500);
	setTimeout(function(){
		document.getElementById('progress').style.width = '55%';
	}, 2750);
	setTimeout(function(){
		document.getElementById('progress').style.width = '60%';
	}, 3000);
	setTimeout(function(){
		document.getElementById('progress').style.width = '65%';
	}, 3250);
	setTimeout(function(){
		document.getElementById('progress').style.width = '70%';
	}, 3500);
	setTimeout(function(){
		document.getElementById('progress').style.width = '75%';
	}, 3750);
	setTimeout(function(){
		document.getElementById('progress').style.width = '80%';
	}, 4000);
	setTimeout(function(){
		document.getElementById('progress').style.width = '85%';
	}, 4250);
	setTimeout(function(){
		document.getElementById('progress').style.width = '90%';
	}, 4500);
	setTimeout(function(){
		document.getElementById('progress').style.width = '95%';
	}, 4750);
	setTimeout(function(){
		document.getElementById('progress').style.width = '100%';
		afterTitle();
	}, 5000);
}

function timerUse(num) {
	switch (num) {
		case 0:
			timer = 0;
			timerActive = 1;
			timeouts.timer = setInterval(function () {
				if (timerActive == 1) {
					timer = timer + 1;
				}
			}, 100);
			break;
		case 1:
			timerActive = 0;
			break;
		case 2:
			timerActive = 1;
			break;
		case 3:
			window.clearInterval(timeouts.timer);
			break;
	}
}

function keyPress(ev){
	switch(ev.key){
		case "1":
		case "2":
		case "3":
		case "4":
			answered((parseInt(ev.key) -1));
			break;
		case "A":
			answered(0);
			break;
		case "B":
			answered(1);
			break;
		case "C":
			answered(2);
			break;
		case "D":
			answered(3);
			break;
			case "a":
				answered(0);
				break;
			case "b":
				answered(1);
				break;
			case "c":
				answered(2);
				break;
			case "d":
				answered(3);
				break;
	}
}
//c is broken

function answered(provided) {
	document.body.removeEventListener("keyup", keyPress);
	var letters = ["A", "B", "C", "D"];
	var correctMotivation = [
		"Well done!",
		"Correct!",
		"Congratulations!",
		"Very good!",
	];
	var wrongMotivation = [
		"Good try!",
		"Better luck next time!",
		"Your answer was incorrect, but that's okay.",
	];
	document.getElementById("question").style.display = "none";
	timerUse(1);
	if (
		binaryToString(correctAnswers[chosenQuestions[currentQuestion]]) ==
		letters[provided]
	) {
		if(sfx == 1){
			soundPlay('c' + (Math.floor(Math.random() * 3)));
		}
		numcorrect += 1;
		document.getElementById("correctTitle").innerHTML =
			correctMotivation[Math.floor(Math.random() * correctMotivation.length)];
		document.getElementById("correct").style.display = "block";
	} else {
		if(sfx == 1){
			soundPlay('w' + (Math.floor(Math.random() * 6)));
		}
		document.getElementById("wrongTitle").innerHTML =
			wrongMotivation[Math.floor(Math.random() * wrongMotivation.length)];
		document.getElementById("correctAnswer").innerHTML =
			answers[chosenQuestions[currentQuestion]][
				letters.indexOf(
					binaryToString(correctAnswers[chosenQuestions[currentQuestion]]),
				)
			];
		document.getElementById("wrong").style.display = "block";
	}
	setTimeout(function () {
		document.getElementById("correct").style.display = "none";
		document.getElementById("wrong").style.display = "none";
		if (nofq - 1 != currentQuestion) {
			if (true) {
				currentQuestion += 1;
				document.getElementById("questionName").innerHTML =
					questions[chosenQuestions[currentQuestion]];
				document.getElementById("answer1").innerHTML =
					answers[chosenQuestions[currentQuestion]][0];
				document.getElementById("answer2").innerHTML =
					answers[chosenQuestions[currentQuestion]][1];
				document.getElementById("answer3").innerHTML =
					answers[chosenQuestions[currentQuestion]][2];
				document.getElementById("answer4").innerHTML =
					answers[chosenQuestions[currentQuestion]][3];
				document.getElementById("question").style.display = "block";
				document.getElementById("nav2").innerHTML = "Question " + (currentQuestion + 1) + " of " + nofq + "";
				document.body.addEventListener("keyup", keyPress);
				timerUse(2);
			} else {
			}
		} else {
			stopBgMusic()
			socket.emit('play');
			document.getElementById("nav1").innerHTML = "Loading Results...";
			document.getElementById("nav2").innerHTML = "";
			document.getElementById("nav2btn").setAttribute("onclick", "");
			document.getElementById("nav3").innerHTML = "Cancel";
			document.getElementById("nav3btn").setAttribute("onclick", "window.location.reload()");
			document.title = "Loading Results..." + " |" + document.title.split("|")[1];
			socket.emit('checkHighscores', {});
		}
	}, 3000);
}

socket.on("checkHighscoresReturn", (data) => {
	var highscoreMotivation = [
		"Congrats, that's a new highscore!",
		"Winner winner, chicken dinner! (or salad if you prefer). You got a new highscore!",
		"You're on the charts! That's a new highscore!",
		"Watch out! You may break our database! You got a new highscore!",
	];
	var nohighscoreMotiation = [
		"You almost got it! Try again and you'll cetainly beat the highscore.",
		"Play again. You'll definitely beat 'em",
		"Just a little faster on those fingers, and you'll be the new highscore!",
		"Pratice makes perfect! Have another go. Maybe you'll get a new highscore this time.",
	];
	var highscore = data[nofq-10];
	if (numcorrect > highscore.correct) {
			soundPlay("nh" + Math.floor(Math.random()*2));
			$("#name-div").dialog({
				dialogClass: "no-close",
				closeOnEscape: false,
				modal: true,
				height: "auto",
				width: "auto",
			});
		document.getElementById("finishedTitle").innerHTML =
			highscoreMotivation[
				Math.floor(Math.random() * highscoreMotivation.length)
			];
	} else {
		if(numcorrect == highscore.correct && timer < highscore.time){
			soundPlay("nh" + Math.floor(Math.random()*2));
			$("#name-div").dialog({
				dialogClass: "no-close",
				closeOnEscape: false,
				modal: true,
				height: "auto",
				width: "auto",
			});
			document.getElementById("finishedTitle").innerHTML =
			highscoreMotivation[
				Math.floor(Math.random() * highscoreMotivation.length)
			];
		}else{
		document.getElementById("finishedTitle").innerHTML =
			nohighscoreMotiation[
				Math.floor(Math.random() * nohighscoreMotiation.length)
			];
		}
	}
	document.getElementById("finishedNumCorrect").innerHTML = numcorrect;
	document.getElementById("finishedNofq").innerHTML = nofq;
	document.getElementById("finishedPercentage").innerHTML = (
		(parseInt(numcorrect) / parseInt(nofq)) *
		100
	).toFixed(2);
	document.getElementById("finishedTime").innerHTML = timer / 10;
	document.getElementById("nav1").innerHTML = "Results";
	document.getElementById("nav2").innerHTML = "";
	document.getElementById("nav2btn").setAttribute("onclick", "");
	document.getElementById("nav3").innerHTML = "Exit";
	document.getElementById("nav3btn").setAttribute("onclick", "window.location.reload()");
	document.title = "Results" + " |" + document.title.split("|")[1];
	document.getElementById("finished").style.display = "block";
});

function binaryToString(input) {
	const output = String.fromCharCode(
		...input.split(" ").map((bin) => parseInt(bin, 2)),
	);

	return output;
}

function closeName(mode){
	switch(mode){
		case 0:
			$("#name-div").dialog("close");
			popup("warning", "A highscore was not recorded. You missed out on the opportinity of you life.");
			break;
		case 1:
			var name = document.getElementById('nameInput').value;
			if(name != "" && name != "NaN" && name != NaN && name != undefined && name != "undefined" && name.length > 1){
				socket.emit('newHighscore', {
					name: name,
					correct: numcorrect,
					nofq: nofq,
					time: timer
				})
				$("#name-div").dialog("close");
				popup("good", "You new highscore was sent.");
			}else{
				popup("bad", "Please enter valid initials (Greater that 1 letter)");
			}
			break;
	}
}

function instructions(mode){
	switch(mode){
		case 0:
			document.getElementById("nav1").innerHTML = "Instructions";
			document.getElementById("nav2").innerHTML = "";
			document.getElementById("nav2btn").setAttribute("onclick", "");
			document.getElementById("nav3").innerHTML = "Close";
			document.getElementById("nav3btn").setAttribute("onclick", "instructions(1)");
			document.title = "Instructions" + " |" + document.title.split("|")[1];
			document.getElementById('home').style.display = "none";
			document.getElementById('instructions').style.display = "block";
			break;
		case 1:
			document.getElementById("nav1").innerHTML = "Home";
			document.getElementById("nav3").innerHTML = "Settings";
			document.getElementById("nav3btn").setAttribute("onclick", "settings(0)");
			document.getElementById("nav2").innerHTML = "Play";
			document.getElementById("nav2btn").setAttribute("onclick", "play()");
			document.title = "Home" + " |" + document.title.split("|")[1];
			document.getElementById('home').style.display = "block";
			document.getElementById('instructions').style.display = "none";
			break;
	}
}

function credits(m) {
	switch(m){
		case 0:
			document.getElementById('home').style.display = "none";
			document.getElementById('credits').style.display = "block";
			document.title = "Credits" + " |" + document.title.split("|")[1];
			document.getElementById("nav1").innerHTML = "Credits";
			document.getElementById("nav2").innerHTML = "";
			document.getElementById("nav2btn").setAttribute("onclick", "");
			document.getElementById("nav3").innerHTML = "Close";
			document.getElementById("nav3btn").setAttribute("onclick", "credits(1)");
			break;
		case 1:
			document.getElementById('home').style.display = "block";
			document.getElementById('credits').style.display = "none";
			document.getElementById("nav1").innerHTML = "Home";
			document.getElementById("nav3").innerHTML = "Settings";
			document.getElementById("nav3btn").setAttribute("onclick", "settings(0)");
			document.getElementById("nav2").innerHTML = "Play";
			document.getElementById("nav2btn").setAttribute("onclick", "play()");
			document.title = "Home" + " |" + document.title.split("|")[1];
			break;
	}
}

function settings(mode) {
	switch (mode) {
		case 0:
			document.getElementById("home").style.display = "none";
			document.getElementById("beforeplay").style.display = "none";
			document.getElementById("settings").style.display = "block";
			document.getElementById("nav1").innerHTML = "Settings";
			document.getElementById("nav2").innerHTML = "Cancel";
			document.getElementById("nav2btn").setAttribute("onclick", "settings(1)");
			document.getElementById("nav3").innerHTML = "Apply";
			document.getElementById("nav3btn").setAttribute("onclick", "settings(2)");
			document.title = "Settings" + " |" + document.title.split("|")[1];
			break;
		case 1:
			document.getElementById("home").style.display = "block";
			document.getElementById("settings").style.display = "none";
			document.getElementById("nav1").innerHTML = "Home";
			document.getElementById("nav3").innerHTML = "Settings";
			document.getElementById("nav3btn").setAttribute("onclick", "settings(0)");
			document.getElementById("nav2").innerHTML = "Play";
			document.getElementById("nav2btn").setAttribute("onclick", "play()");
			document.title = "Home" + " |" + document.title.split("|")[1];
			break;
		case 2:
			if(document.getElementById('music').checked == true){
				music = 1;
			}else{
				music = 0;
			}
			if(document.getElementById('sfx').checked == true){
				sfx = 1;
			}else{
				sfx = 0;
			}
			document.getElementById("home").style.display = "block";
			document.getElementById("settings").style.display = "none";
			document.getElementById("nav1").innerHTML = "Home";
			document.getElementById("nav3").innerHTML = "Settings";
			document.getElementById("nav3btn").setAttribute("onclick", "settings(0)");
			document.getElementById("nav2").innerHTML = "Play";
			document.getElementById("nav2btn").setAttribute("onclick", "play()");
			document.title = "Home" + " |" + document.title.split("|")[1];
			break;
	}
}