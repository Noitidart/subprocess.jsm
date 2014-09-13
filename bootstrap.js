const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	id: 'subprocess.jsm',
	suffix: '@jetpack',
	path: 'chrome://subprocess.jsm/content/',
	aData: 0,
};
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/devtools/Console.jsm');


function install() {}

function uninstall() {}

function startup() {
	//import self modules
	Cu.import(self.path + 'modules/subprocess.jsm');
	console.info(subprocess);
	
	if (Services.appinfo.OS == 'WINNT') {
		var ps = 'C:\\windows\\system32\\tasklist.exe';
		var args = [];
		
		var buffer = [];
		subprocess.call({
			command: ps,
			arguments: args,
			stdout: function(data) {
				buffer.push(data);
			},
			done: function() {
				//var lines = buffer.join('').split('\n');
				console.log('buffer:', buffer)
			}
		});
	} else if (Services.appinfo.OS == 'Linux') {
		//subprocess example for non windows not yet implemented but plan to jack from here: https://github.com/ochameau/adbhelper/blob/fd3073a0f5f51e1707a5b4cbace82b13fb5a1fe5/adb.js#L192
		//tested this on Ubuntu 14.04
		Cu.import('resource://gre/modules/osfile.jsm');
		var ps = '/bin/bash';
		console.log(OS.Path.join(OS.Constants.Path.profileDir, '.parentlock'))
		var args = ['-c', 'lsof ' + OS.Path.join(OS.Constants.Path.profileDir, '.parentlock').replace(/\W/g, '\\$&')]; //if you remove the `.replace(/\W/g, '\\$&')` it won't work, so must have that
		
		var buffer = [];
		console.time('testSub')
		subprocess.call({
			command: ps,
			arguments: args,
			stdout: function(data) {
				buffer.push(data);
			},
			done: function() {
				console.timeEnd('testSub')
				//var lines = buffer.join('').split('\n');
				console.log('buffer:', buffer)
			}
		});
	} else {
		console.warn('no example for your os. OS:', Services.appinfo.OS);
	}
}
 
function shutdown(aReason) {
	if (aReason == APP_SHUTDOWN) return;
	Cu.unload(self.path + 'modules/subprocess.jsm');
}
