//Create a controller in my angular app
app.controller('indexController', ["$scope", 'indexFactory', ($scope, indexFactory) => {

    /*
        $scope: It is simply used to transfer data between Scope, Controller, and View, and to run the Controller-side method.
    */

    // ... Define messages array for storing users' messages
    $scope.messages = [ ];
    
    $scope.players = [ ];

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

            socket.on('initPlayers', (players) => {
                $scope.players = players;
                $scope.$apply();
            });

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
                
                // ... Push all data to players for showing new player to old players
                $scope.players[data.id] = data;


                //... Apply the changes
                $scope.$apply();
            });

            // ... Receiver disconnect data from the server side
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

                // .. If any players disconnect, the others going to see
                delete $scope.players[user.id];

                //... Apply the changes
                $scope.$apply();
            });

            // ... Receive broadcast emit each data x and y position from server
            socket.on('animate', (data) => {
                $("#"+data.socketId).animate({ 'left': data.x, 'top': data.y }, () => {
                    animate = false;
                });
            });
        
            // ... One animation will not start until the other animation ends control
            let animate = false;

            // ... Click area function to move the ball
            $scope.onClickPlayer = ($event) => {
                //Get position from client side
                //console.log($event.offsetX, $event.offsetY);

                if(!animate){
                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    // ... Emit x and y positiyon to server
                    socket.emit('animate', {x,y})

                    animate = true;
                    // ... Animate the ball by userid using jquery anime function
                    // Wait anime until it is over
                    $("#"+socket.id).animate({ 'left': x, 'top': y }, () => {
                        animate = false;
                    });
                };
            };

        }).catch((err) => {
            console.log(err);
        });
    }

    

}]);