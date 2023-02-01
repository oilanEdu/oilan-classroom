import {io} from 'socket.io-client';

const options = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"]
}

const socket = io("wss://realibi.kz:3031", options);

export default socket;