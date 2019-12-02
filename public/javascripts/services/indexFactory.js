//Add factory to in my angular app
app.factory('indexFactory', [() => {
	// ... 2 Parameter (url, options) from indexController
	const connectSocket = (url, options) => {
		return new Promise((resolve, reject) => {
			const socket = io.connect(url, options);

			// ... If socket connect return socket
			socket.on('connect', () => {
				resolve(socket);
			});

			// ... Else return error
			socket.on('connect_error', () => {
				reject(new Error('connect_error'));
			});
		});
	};

	return {
		connectSocket
	}
}]);