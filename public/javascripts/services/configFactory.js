//Add factory to in my angular app
app.factory('configFactory', [ '$http', ($http) => {
	const getConfig = () => {
		return new Promise((resolve, reject) => {
			$http.get('/enviroment').then((data) => {
				resolve(data);
			}).catch((err) => {
				reject(err);
			});
		});
	};
	return { getConfig }
}]);