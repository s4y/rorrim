var express = require('express'),
	fs = require('fs'),
	path = require('path');

express.createServer(function(req, res, next){
	if (req.method === 'GET') {
		fs.readdir(path.join(__dirname, 'hosts'), function(err, dirs){
			var host = req.headers.host, name;
			if (err) {
				next(err);
			} else if (dirs.indexOf(req.headers.host) != -1) {
				express.static(path.join(__dirname, 'hosts', req.headers.host))(req, res, next);
			} else if (req.url === '/') {
				res.send('rorrim', { 'Content-Type': 'text/plain; charset=utf-8' });
			} else {
				next();
			}
		});
	} else {
		next();
	}
}).listen(80);