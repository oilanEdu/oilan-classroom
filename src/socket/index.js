import {io} from 'socket.io-client';
import globals from "../globals";

const options = {
	"force new connection": true,
	withCredentials: true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"]
}

const socket = io("localhost:3031", options);
// const socket = io(ENDPOINT, {  
//         cors: {
//         origin: "wss://realibi.kz:3031",
//         credentials: true
//       },transports : ['websocket'],
//       	"force new connection": true,
// 		reconnectionAttempts: "Infinity",
// 		timeout: 10000 });

export default socket; 