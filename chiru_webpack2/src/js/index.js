import '../scss/index.scss';

const promise = new Promise((resolve) => {

	setTimeout(()=> {
		console.log('成功');
		resolve('OK');
	}, 3000);
});


promise.then(response => {
	console.log(response);
});