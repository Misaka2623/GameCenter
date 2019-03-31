var mysql	= require('mysql');
var connection	= mysql.createConnection({
	host	:	'csc346-project2.c3jmudlmcgqc.us-east-1.rds.amazonaws.com',
	user	:	'lihanwei4c',
	password:	'gamecenterdbpassword',
	database:	'GameInfo'
});


connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

function login(){
	let username = document.getElementById("username").nodeValue;
	let password = document.getElementById("password").nodeValue;
	console.log("username: " + username);
	console.log("password:" + password);
	let getRowQuery = "SELECT hashed_password FROM user_info WHERE username = " + mysql.escape(username);
	const bcrypt = require('bcrypt');
	const saltSeed = 10;
	connection.query(getRowQuery, function(err, result){
		if(err) throw err;
		console.log(result);
	});
	/*
	bcrypt.genSalt(saltSeed, function(err, salt){
		bcrypt.hash(password, salt, )
	});*/
}