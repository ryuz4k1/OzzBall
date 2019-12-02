//Create a controller in my angular app
app.controller('indexController', ["$scope", 'indexFactory', ($scope, indexFactory) => {

    /*
        $scope: It is simply used to transfer data between Scope, Controller, and View, and to run the Controller-side method.
    */

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
            // ... Emit username from client side for new user using a currently socket
            socket.emit('newUser', { username: username });
            console.log("Bağlantı gerçekleşti", socket);
        }).catch((err) => {
            console.log(err);
        });
    }

    

}]);