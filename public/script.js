var socket = io();
var nofq = 10;
var timeouts = {
	popup: null,
	timer: null,
};
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
	console.log(data);
});

function init() {
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
		draggable: false,
		height: "auto",
		width: "auto",
	});
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

function startPlay() {
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
	document.getElementById("beforeplay").style.display = "none";
	document.getElementById("questionName").innerHTML =
		questions[chosenQuestions[0]];
	document.getElementById("answer1").innerHTML = answers[chosenQuestions[0]][0];
	document.getElementById("answer2").innerHTML = answers[chosenQuestions[0]][1];
	document.getElementById("answer3").innerHTML = answers[chosenQuestions[0]][2];
	document.getElementById("answer4").innerHTML = answers[chosenQuestions[0]][3];
	document.getElementById("question").style.display = "block";
	timerUse(0);
}

function timerUse(num) {
	switch (num) {
		case 0:
			timer = 0;
			timerActive = 1;
			timeouts.timer = setInterval(function () {
				if (timerActive == 1) {
					timer = timer + 1;
					console.log(timer);
				}
			}, 1000);
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

function answered(provided) {
	document.getElementById("question").style.display = "none";
	timerUse(1);
	if (
		binaryToString(correctAnswers[chosenQuestions[currentQuestion]]) == provided
	) {
		console.log("Correct");
		numcorrect += 1;
		document.getElementById('correct').style.display = 'block';
	} else {
		console.log("Wrong");
	}
	setTimeout(function(){
		document.getElementById('correct').style.display = 'none';
		if (nofq-1 != currentQuestion) {
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
				timerUse(2);
			} else {
			}
		}else{
			console.log('finished');
		}
	}, 2000);
}

function binaryToString(input) {
	const output = String.fromCharCode(
		...input.split(" ").map((bin) => parseInt(bin, 2)),
	);

	return output;
}

//socket.emit("play");

function credits() {}

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
