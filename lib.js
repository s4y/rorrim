var Rorrim = {},
	 fs = require('fs'),
	 path = require('path');

Rorrim.hostfile = '/etc/hosts',
Rorrim.origHostString = fs.readFileSync(Rorrim.hostfile, 'utf8'),
Rorrim.host = 'cdnjs.cloudflare.com',
Rorrim.comment = "\n# Rorrim Host Entries Below\n" + "###########################\n";
Rorrim.endComment = "\n# End Rorrim Entries #",
Rorrim.rorrimFolder = path.join(process.env.HOME, '.rorrim/'),
Rorrim.hostsFolder = path.join(this.rorrimFolder, 'hosts'),
Rorrim.backupPath = path.join(this.rorrimFolder, 'hostfile.bak');
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
	newHostString = this.origHostString + this.comment + newHostString + this.endComment;
	fs.writeFileSync(this.hostfile, newHostString, 'utf8');
}
Rorrim.walkRorrimFolder = function(folderPath){
	var folderPath = folderPath || this.hostsFolder;
	return fs.readdirSync(folderPath).filter(function(file){return fs.statSync(path.join(folderPath, file)).isDirectory();}); //funny synchronous oneliner
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
}

module.exports = Rorrim;
