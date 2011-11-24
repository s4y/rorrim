var Rorrim = {},
	 fs = require('fs'),
	 path = require('path'),
	 childProcess = require('child_process'),
	 url = require('url');

Rorrim.hostfile = '/etc/hosts',
Rorrim.origHostString = fs.readFileSync(Rorrim.hostfile, 'utf8'),
Rorrim.host = 'cdnjs.cloudflare.com',
Rorrim.COMMENT = "\n# Rorrim Host Entries Below\n" + "###########################\n" + "# Don't Modify Below Here #\n";
Rorrim.END_COMMENT = "\n# End Rorrim Entries #\n",
Rorrim.rorrimFolder = path.join(process.env.HOME, '.rorrim/'),
Rorrim.hostsFolder = path.join(Rorrim.rorrimFolder, 'hosts'),
Rorrim.backupPath = path.join(Rorrim.rorrimFolder, 'hostfile.bak'),
Rorrim.rorrimHostsRE = RegExp(Rorrim.COMMENT + "[\\s\\S]*" + Rorrim.END_COMMENT);
//Rorrim.pathWithArgs = process.argv.join(' ');

Rorrim.createBackupHostFile = function(backupPath){ //Maybe change to ensureBackupExists
	var localBackupPath = (backupPath === undefined) ? this.backupPath : backupPath;
	fs.closeSync(fs.openSync(localBackupPath, 'a+', '0777'));
}
Rorrim.backupHostFile = function(backupPath, origHostString){
	var localBackupPath = (backupPath === undefined) ? this.backupPath : backupPath,
		 localOrigHostString = (origHostString === undefined) ? this.origHostString : origHostString;
	fs.writeFileSync(localBackupPath, localOrigHostString, 'utf8');
}
Rorrim.revertHostFile = function(backupPath, hostfile){
	var localBackupPath = (backupPath === undefined) ? this.backupPath : backupPath,
		 localHostfile = (hostfile === undefined) ? this.hostfile : hostfile;
	fs.readFile(localBackupPath, function(err, data){
		fs.writeFileSync(localHostfile, data);
	});
}
Rorrim.writeHostFile = function(hosts){
	var newHostString;
	if(typeof hosts == 'object' && typeof hosts[0] == 'string'){
		//Trying to pass multiple hosts in
		hosts.forEach(function(singleHost){
			newHostString += ("127.0.0.1\t" + singleHost + "\n");
		});
	} else if(typeof hosts == 'string'){
		newHostString = ("127.0.0.1\t" + hosts);
	} else if(typeof hosts == 'object' && hosts.length == 0){
		console.warn("Empty Array passed to writeHostFile, maybe ~/.rorrim/hosts/ is empty?");
		return;
	} else {
		throw new Error("Bad Argument to writeHostFile");
	}
	newHostString = this.origHostString + this.COMMENT + newHostString + this.END_COMMENT;
	fs.writeFileSync(this.hostfile, newHostString, 'utf8');
}
Rorrim.cleanupHostFile = function(){
	var hostfile = fs.readFileSync(this.hostfile, 'utf8');
	if(hostfile.match(this.COMMENT) !== null){
		console.log("Cleaning Up Hostfile");
		hostfile = hostfile.replace(this.rorrimHostsRE, ""); this.origHostString = hostfile;
		fs.writeFileSync(this.hostfile, hostfile, 'utf8');
	}
}
Rorrim.walkRorrimFolder = function(folderPath){
	var folderPath = folderPath || this.hostsFolder;
	return fs.readdirSync(folderPath).filter(function(file){return fs.statSync(path.join(folderPath, file)).isDirectory();}); //funny synchronous oneliner
}
Rorrim.self = function() { return this; };
Rorrim.install = function(input){
	var parsedUrl = url.parse(input),
		 urlObject = {host: parsedUrl.host, port: parsedUrl.port, path:parsedUrl.pathname},
		 hostname = parsedUrl.hostname,
		 filename = path.join(Rorrim.hostsFolder, hostname, parsedUrl.pathname);
	childProcess.exec('mkdir -p ' + path.dirname(filename), function(err){
		if(err){
			throw err;
		} else {
			var fileStream = fs.createWriteStream(filename);
				 console.log(filename);
				 console.log(fileStream);
			console.log(parsedUrl);

			if(parsedUrl.protocol !== undefined){
				switch(parsedUrl.protocol){
				  case "http:":
					  require('http').get(urlObject, function(res){
							res.on('data', function(chunk){
								//console.log(chunk);
								fileStream.write(chunk);
							});
					  });
					  console.log("HTTP");
					  break;
				  case "https:":
					  console.log("HTTPS");
					  break;
				  default:
					  console.warn("That's not a fully qualified domain");
					  process.exit(11);
				}
			}
			//Rorrim.installFiles(input);
		}
	});
}
Rorrim.installFiles = function(path){
	console.log("Not implemented yet");
}
Rorrim.getFiles = function(url){
	console.log("Sorry not implemented either");
}
Rorrim.checkInit = function(){
	try {
		fs.readdirSync(this.rorrimFolder);
	} catch (e){
		console.log(".rorrim folder not found, creating it");
		fs.mkdirSync(this.rorrimFolder, '0755');
		this.hostsFolder = path.join(this.rorrimFolder, 'hosts');
		this.backupPath = path.join(this.rorrimFolder, 'hostfile.bak');
		console.log(this.rorrimFolder);
		console.log(this.hostsFolder);
		fs.mkdirSync(this.hostsFolder, '0755');
		this.createBackupHostFile();
		console.log(this.backupPath);
	}
	this.cleanupHostFile();
}

module.exports = Rorrim;
