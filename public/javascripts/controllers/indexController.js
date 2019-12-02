app.controller('indexController', ["$scope", 'indexFactory', (scope,indexFactory) => {
    //const socket = io.connect("http://localhost:3000");

    const connectionOptions = {
        reconnectionAttempts:3,
        reconnectionDelay:500
    };

    indexFactory.connectSocket("http://localhost:3000",connectionOptions).then((socket) => {
        console.log("Bağlantı gerçekleşti", socket);
    }).catch((err) => {
        console.log(err);
    });

}]);