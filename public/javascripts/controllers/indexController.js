//Create a controller in my angular app
app.controller('indexController', ["$scope", 'indexFactory', ($scope, indexFactory) => {

    /*
        $scope: It is simply used to transfer data between Scope, Controller, and View, and to run the Controller-side method.
    */

    // ... Define messages array for storing users' messages
    $scope.messages = [ ];

    // ... First time open the application, init() function will be start
    $scope.init = () => {
        const username = prompt('Please enter your name: ');
        if (username) {
            initSocket(username);
        }else{
            return false;
        }
    };

    

    function initSocket(username) {
        // ... Socket Connection Options
        const connectionOptions = {
            reconnectionAttempts:3,
            reconnectionDelay:500
        };
        // ... Check Socket Connection from indexFactory in services
        indexFactory.connectSocket("http://localhost:3000",connectionOptions).then((socket) => {
            console.log("Bağlantı gerçekleşti", socket);

            // ... Emit username from client side for new user using a currently socket
            socket.emit('newUser', { username: username });

            // Receive broadcast emit data from the server side
            socket.on('newUser', (data) => {
                const messageData = {
                    type: {
                        code: 0, //server or user message
                        messageType: 1 //joined room message
                    },
                    username: data.username
                };
                // ... Push message data to messageData
                $scope.messages.push(messageData);

                //... Apply the changes
                $scope.$apply();
            });

            socket.on('thisUser', (user) => {
                const messageData = {
                    type: {
                        code: 0, //server or user message
                        messageType: 0 //disconnected message
                    },
                    username: user.username
                };
                // ... Push message data to messageData
                $scope.messages.push(messageData);

                //... Apply the changes
                $scope.$apply();
            });


        }).catch((err) => {
            console.log(err);
        });
    }

    

}]);