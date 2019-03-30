var mysql	= require('mysql');
var connection	= mysql.createConnection({
	host	:	'csc346-project2.c3jmudlmcgqc.us-east-1.rds.amazonaws.com',
	user	:	'lihanwei4c',
	password:	'gamecenterdbpassword'
});


connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});
