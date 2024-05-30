var socket = io({
	ackTimeout: 9999999999,
	retries: 9999999999
});
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', (event) => {
	event.preventDefault();
	if(input.value){
		socket.emit('message', {
			message: input.value
		});
		input.value = '';
	}
})

socket.on('serverMessage', (data) => {
	alert('serversays: ' + data.message);
})
