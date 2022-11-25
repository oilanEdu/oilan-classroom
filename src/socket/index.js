import {io} from 'socket.io-client';

const options = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"]
}

const socket = io('https://realibi.kz', options);

export default socket;