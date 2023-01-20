import {io} from 'socket.io-client';
import globals from "../globals";

const options = {
	"force new connection": true,
	withCredentials: true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"]
}

const socket = io("wss://realibi.kz:3031", options);

export default socket; 