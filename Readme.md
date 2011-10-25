rorrim | mirror
==

rorrim is a tiny server that allows offline development without
dependencies on CDN's

Simply install with `npm install -g rorrim`

Then run `rorrim`

Currently there are two ways to add files to rorrim's cache:
 * the (potentially buggy) command line flag
	`rorrim -i "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"`
 * and by manually copying files into a directory under
   `~/.rorrim/hosts` named the same as the hostname for example
	`~/.rorrim/hosts/cdnjs.cloudflare.com`

Eventually it will be easier to interact with rorrim, but this is just
an "MVP".

Running `rorrim --help` will show you some basic usage
