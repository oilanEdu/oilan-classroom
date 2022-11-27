import {io} from 'socket.io-client';
import globals from "../globals";

const options = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"]
}

const socket = io('91.201.215.148:3000', options);

export default socket;