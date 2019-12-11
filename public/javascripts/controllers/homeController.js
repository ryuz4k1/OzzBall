//Create a controller in my angular app
app.controller('homeController', ["$scope", 'homeFactory', ($scope, homeFactory) => {
    // ... Get username
    var btn = document.getElementById('myButton');
    btn.addEventListener('click', () => {
        homeFactory.getUsername().then(data => {
            window.document.location = '/game?username='+data
        });
    });

}]);