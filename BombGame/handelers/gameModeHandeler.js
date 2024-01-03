// Import the Socket.io client library
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL


async function getLetters() {
    console.log("fetching")
    socket.on('connect', () => {
        // Emit 'startGame' event when the client socket connects to the server
        socket.emit('startGame');
    });

    // Listen for the 'letters' event from the server
    await socket.on('letters', (lettersData) => {
        // Handle the received 'letters' data here
        console.log('Received letters data:', lettersData);
        // Perform actions with the received data as needed
        return lettersData;
    });
}


export const gameModeMethods = {
    getLetters
}