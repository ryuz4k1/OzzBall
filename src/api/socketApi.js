// ... Import socketio module
const socketio = require("socket.io");
// ... Calling socketio constructor
const io = socketio();
// ... Transfer constructor to my socketApi variables for using server in www
const socketApi = { };
socketApi.io = io;

// ... Define users array for currently users
const users = [ ];

io.on('connect', (socket) => {
    console.log("User connected");

    // ... Receive data from the client side
    socket.on('newUser', (data) => {
        //... Initialize default user data
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            }
        };
        // ... Combine data and defaultData together
        const userData = Object.assign(data, defaultData);

        // ... Push the userData to users array for storing all users
        users.push(userData);
        //console.log(users);
    });

});



module.exports = socketApi;
