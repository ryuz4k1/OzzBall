//Create a controller in my angular app
app.controller('indexController', ["$scope", 'indexFactory' , 'configFactory', ($scope, indexFactory, configFactory) => {

    /*
        $scope: It is simply used to transfer data between Scope, Controller, and View, and to run the Controller-side method.
    */

    // ... Define messages array for storing users' messages
    $scope.messages = [ ];
    
    $scope.players = [ ];

    let username;

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }


    function scrollTop(){
        setTimeout(() => {
            const chatArea = document.getElementById('chatArea');
            chatArea.scrollTop = chatArea.scrollHeight;
        });
    };

    function showBubble(id, message) {
        // ... Show user message
        $('#'+id).find('.message').show().html(message);

        // ... Hide user's message after 2 seconds
        setTimeout(() => {
            $('#'+id).find('.message').hide().html(message);
        },2000)
    };

    async function initSocket(){
        try{
            // ... Socket Connection Options
            const connectionOptions = {
                reconnectionAttempts:3,
                reconnectionDelay:500
            };

            const config = await configFactory.getConfig();
            // ... Check Socket Connection from indexFactory in services
            const socket = await indexFactory.connectSocket(config.data.socketUrl,connectionOptions);
            
            
            username = getParameterByName('username');
            if(!username){
                return alert('Username cannot be null');
            }
            //console.log("Bağlantı gerçekleşti", socket);

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

                scrollTop();


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

                scrollTop();

                //... Apply the changes
                $scope.$apply();
            });

            // ... Receive broadcast emit each data x and y position from server
            socket.on('animate', (data) => {
                $("#"+data.socketId).animate({ 'left': data.x, 'top': data.y }, () => {
                    animate = false;
                });
            });

            socket.on('newMessage', (message) => {
                $scope.messages.push(message);
                $scope.$apply();
                // ... Show message for all users
                showBubble(message.socketId, message.text);
                scrollTop();
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

            $scope.newMessage = () => {
                let message = $scope.message;
                const messageData = {
                    type: {
                        code: 1, //server or user message
                    },
                    username: username,
                    text: message
                };
                // ... Push message data to messageData
                $scope.messages.push(messageData);
                
                // ... Clean message after send a message
                $scope.message = '';
                
                // ... Send message data to server
                socket.emit('newMessage', messageData);

                // ... Show message to me
                showBubble(socket.id, message);
                
                scrollTop();
            };
        }
        catch(error){
            console.log(error);
        };
    };

    initSocket();

    

}]);