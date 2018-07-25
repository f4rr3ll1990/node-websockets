const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });




// 

const sendMsg = (data) => {

	wss.clients.forEach( client => {

		if(client.readyState === WebSocket.OPEN) {
			client.send(data);
		}

	});
};

wss.on('connection', ws => {
	console.log('connection');

	ws.on('message', data => {
		let msgdata = JSON.parse(data);
		console.log(msgdata.message);
		if (msgdata.message === '/exit') {

			ws.close();

		} else if (msgdata.message === '/sayhi') {

			let sayhi = JSON.stringify ({
				name: 'Бот Валера',
				message: 'Привет всем!!!'
			});
			ws.send(sayhi);

		} else {

			sendMsg(data);

		}
	});
	let wellcome = JSON.stringify ({
		name: 'Бот Валера',
		message: 'Добро пожаловать! Команды чтобы напрячь Валеру => "/name" - Представится; "/sayhi" - Сказать Привет; "/exit" - Покинуть чат;'
	});
	ws.send(wellcome);
});
