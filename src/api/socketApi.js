const socketio = require("socket.io");
const io = socketio();
const socketApi = { };
socketApi.io = io;


io.on('connect', () => {
    console.log("User connected");
});



module.exports = socketApi;
