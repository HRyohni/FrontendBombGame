// Import the Socket.io client library
import io from 'socket.io-client';
const socket = io('http://localhost:3000'); // Replace with your server URL

function connectToRoom(roomName)
{
    socket.on('connect', () => {
        // Join a specific room
        socket.emit('joinRoom', roomName);
    });
}
function sendMessage(roomName)
{
    socket.on('connect', () => {
        // Join a specific room
        socket.emit('sendMessage', "this is a new mesg");
    });
}


function print(msg)
{
    socket.on('print', (msg));
}

export const playerMethods = {
    connectToRoom,
    print
}
