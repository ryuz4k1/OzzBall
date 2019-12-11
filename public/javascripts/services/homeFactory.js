//Add factory to in my angular app
app.factory('homeFactory', [() => {
	const getUsername = () => {
		return new Promise((resolve, reject) => {
            //const username = prompt('Please enter your name: ');
            const username = $('#username').val();
            console.log('HomeFactory username: ' , username);
            if (username) {
                resolve(username);
            }else{
                reject(false);
            }
		});
	};
	return { getUsername }
}]);