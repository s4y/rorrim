var express = require('express'),
	 fs = require('fs'),
	 path = require('path'),
	 rorrimFolder = path.join(process.env.HOME, '.rorrim/'),
	 hostsDir = path.join(rorrimFolder, 'hosts'),
	 app;

app = express.createServer(
	function(req, res, next){
		if (req.method === 'GET') {
			fs.readdir(hostsDir, function(err, dirs){
				var host = req.headers.host, name;
				if (err) {
					next(err);
				} else if (dirs.indexOf(req.headers.host) != -1) {
					express.static(path.join(hostsDir, req.headers.host))(req, res, next);
				} else {
					next();
				}
			});
		} else {
			next();
		}
	}
);
app.get('/', function(req, res, next){
	res.send('rorrim', { 'Content-Type': 'text/plain; charset=utf-8' });
});
module.exports.app = app;
