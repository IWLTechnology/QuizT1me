var socket = io();
var nofq = 10;
var timeouts = {
	popup: null
};

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

function init() {
	document.getElementById("home").style.display = "block";
}

function play() {
	document.getElementById("settings").style.display = "none";
	document.getElementById("home").style.display = "none";
	document.getElementById("beforeplay").style.display = "block";
	document.getElementById("nav1").innerHTML = 'Play';
	document.getElementById("nav2").innerHTML = 'Back';
	document.getElementById("nav2btn").setAttribute('onclick','exitPlay()');
	document.getElementById("nav3").innerHTML = 'Play';
	document.getElementById("nav3btn").setAttribute('onclick','startPlay()');
	document.title = "Play" + " |" + document.title.split('|')[1];
}

function exitPlay(){
	document.getElementById("home").style.display = "block";
	document.getElementById("beforeplay").style.display = "none";
	document.getElementById("nav1").innerHTML = 'Home';
	document.getElementById("nav3").innerHTML = 'Settings';
	document.getElementById("nav3btn").setAttribute('onclick','settings(0)');
	document.getElementById("nav2").innerHTML = 'Play';
	document.getElementById("nav2btn").setAttribute('onclick','play()');
	document.title = "Home" + " |" + document.title.split('|')[1];
}

function changeQuestions(){
		$("#nofq-div").dialog({
				dialogClass: "no-close",
				closeOnEscape: false,
				draggable: false,
				height: "auto",
				width: "auto"
			});
}

function closenofq(num){
	switch(num){
		case 0:
			$("#nofq-div").dialog( "close" );
			break;
		case 1:
			$("#nofq-div").dialog( "close" );
			if(parseInt(document.getElementById('nofq-input').value) && parseInt(document.getElementById('nofq-input').value) > 9 && parseInt(document.getElementById('nofq-input').value) < 21){
				nofq = parseInt(document.getElementById('nofq-input').value);
				popup('good', 'The number of questions has been successfully changed!');
			}else{
				nofq = 10;
				popup('warning', 'An incorrect value was inputted, the number of questions has been set to 10.');
			}
			break;
	}
}

function popup(status, message){
	window.clearTimeout(timeouts.popup);
	var popup = document.getElementById('popup');
	var box = document.getElementById('popupBox');
	popup.innerHTML = message;
	box.className = status + " w3-center alfa-slab-one";
	box.style.opacity = 1;
	timeouts.popup = setTimeout(function() {
		document.getElementById('popupBox').style.opacity = 0;
	}, 5000);
	
}

function startPlay(){
	alert('start');
}

//socket.emit("play");

function credits() {
	
}

function settings(mode) {
	switch (mode) {
		case 0:
			document.getElementById("home").style.display = "none";
			document.getElementById("beforeplay").style.display = "none";
			document.getElementById("settings").style.display = "block";
			document.getElementById("nav1").innerHTML = 'Settings';
			document.getElementById("nav2").innerHTML = 'Cancel';
			document.getElementById("nav2btn").setAttribute('onclick','settings(1)');
			document.getElementById("nav3").innerHTML = 'Apply';
			document.getElementById("nav3btn").setAttribute('onclick','settings(2)');
			document.title = "Settings" + " |" + document.title.split('|')[1];
			break;
		case 1:
			document.getElementById("home").style.display = "block";
			document.getElementById("settings").style.display = "none";
			document.getElementById("nav1").innerHTML = 'Home';
			document.getElementById("nav3").innerHTML = 'Settings';
			document.getElementById("nav3btn").setAttribute('onclick','settings(0)');
			document.getElementById("nav2").innerHTML = 'Play';
			document.getElementById("nav2btn").setAttribute('onclick','play()');
			document.title = "Home" + " |" + document.title.split('|')[1];
			break;
		case 2:
			document.getElementById("home").style.display = "block";
			document.getElementById("settings").style.display = "none";
			document.getElementById("nav1").innerHTML = 'Home';
			document.getElementById("nav3").innerHTML = 'Settings';
			document.getElementById("nav3btn").setAttribute('onclick','settings(0)');
			document.getElementById("nav2").innerHTML = 'Play';
			document.getElementById("nav2btn").setAttribute('onclick','play()');
			document.title = "Home" + " |" + document.title.split('|')[1];
			break;
	}
}
