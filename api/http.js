const http = require('http');
const url = require('url');

const port = process.env.API_PORT;

const server = http.createServer((req, res) => {
	const queryObject = url.parse(req.url, true).query;
	console.log(queryObject);

	if (queryObject.id === '594508445550641171') {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(`{"ok": ${queryObject.auth === '123456'}}`);
	}
	else {
		res.statusCode = 403;
		res.end();
	}
});

server.listen(port, (arg) => {
	console.log(arg);
	console.log(`Server running at port ${port}`);
});

//http://localhost:3033/?id=594508445550641171&ctrl=hellvoice&auth=123456
