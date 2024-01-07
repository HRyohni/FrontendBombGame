import io from 'socket.io-client';
import {user} from "./UserHandeler";

const socket = io('http://localhost:3000'); // Replace with your server URL

function connectToRoom(roomName) {
    socket.join(roomName);
    console.log("connect to room: ", roomName);

}

function joinChat(username) {
    socket.emit('new user', username);
}

function broadcastMsg(room, msg) {
        socket.emit("broadcast", room, msg);
}

function disconnectFromRoom(roomName) {
    console.log("disconnected");
    socket.emit('leaveRoom', roomName);

}

export const playerMethods = {
    connectToRoom,
    disconnectFromRoom,
    broadcastMsg,
    joinChat,
}
