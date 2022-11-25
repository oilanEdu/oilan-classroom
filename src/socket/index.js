import {io} from 'socket.io-client';
import globals from "../../src/globals";

const options = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"]
}

const socket = io(globals.productionServerDomain, options);

export default socket;