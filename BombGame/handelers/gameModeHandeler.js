// Import the Socket.io client library
import io from 'socket.io-client';

const socket = io('/'); // Replace with your server URL


function getLetters(gameName,room) {
    return new Promise((resolve, reject) => {
        socket.emit('startGame',gameName,room);

        socket.on('letters', (letters) => {
            resolve(letters);
        });

        // You may want to handle potential errors here
        socket.on('error', (error) => {
            reject(error);
        });
    });

}

function checkWord(word, TwoLettersToCheck) {
    return new Promise((resolve, reject) => {
        socket.emit('checkWord', "colors", word);

        socket.on('result', (result) => {
            resolve(result);
        });

        // You may want to handle potential errors here
        socket.on('error', (error) => {
            reject(error);
        });
    });


}


export const gameModeMethods = {
    getLetters,
    checkWord

}