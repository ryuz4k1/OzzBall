// ... Import socketio module
const socketio = require("socket.io");
// ... Calling socketio constructor
const io = socketio();
// ... Transfer constructor to my socketApi variables for using server in www
const socketApi = { };
socketApi.io = io;

// ... Define users object for currently users
const users = { };

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

        // ... Insert each user information into that user's id
        users[socket.id] = userData;
        //console.log(users);

        // ... Broadcast emit for sharing all users' data to client side for all users
        socket.broadcast.emit('newUser', users[socket.id]);
    });

    // ... Information will be sent to other users except the user
    socket.on('disconnect', () => {
        socket.broadcast.emit('thisUser', users[socket.id]);
        // ... Delete user from users object
        delete users[socket.id];
    });


});



module.exports = socketApi;
