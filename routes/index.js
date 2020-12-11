var db=require("./db")
var mysql=require("mysql")
var db_url=db.db_url;
var db_url=db.db_url
var db_user=db.db_user
var db_host=db.db_host
var db_pass=db.db_pass
var log_data=db.log_data;
var connection=mysql.createConnection(
{
   host: db_host,
   user :db_user,
   password: db_pass,
   database:db_url,
   waitForConnections: true,
   connectionLimit:1000
})
exports.index=function (req,res) {
	var data={req:req,res:res}
	var rq=req.query.rq;
	if(req.cookies.user&&req.cookies.user!="0")
		req.user=req.cookies.user;
	if(req.user)
		return res.redirect("/market")
	if(rq=="register"){
		register_user(data,function () {
			data.req=0;data.res=0;
			res.send(data)
		})
	}
	else if(rq=="verify-code"){
		verify_code(data,function () {
			data.req=0;data.res=0;
			res.send(data)
		})
	}
	else if(rq=="send-reset-code"){
		send_reset_code(data,function () {
			data.req=0;data.res=0;
			res.send(data)
		})
	}
	else if(rq=="reset-password"){
		reset_password(data,function () {
			data.req=0;data.res=0;
			res.send(data)
		})
	}
	else if(rq=="fetch-number")
	{
		var username=req.query.username

		db.get_user(username,function(user){
			data.user=user;
			data.req=0;data.res=0;
			res.send(data)
		})
	}
	else
		res.render("index",data)
}
function verify_code(data,callback) {
	var req=data.req;
	var reset_code=req.query.reset_code
	var id=req.query.id
	var table=req.query.table;
	var phone=req.query.phone
	var q="SELECT *FROM "+table+" WHERE id=? AND reset_code=SHA1(?)"
	connection.query(q,[id,reset_code],function (err,rst) {
		
		if(rst&&rst.length){
			//verified; correct
			var id=rst[0].id;
			var password=gen_pass()
			q="UPDATE "+table+" SET status=1,password=SHA1(?) WHERE id=?"
			connection.query(q,[password,id],function (err,rst) {
				callback()
			})
		}
		else{
			//incorrect code
			data.errmsg="Incorrect verification code"
			callback()
		}
		
	})

}
function send_reset_code(data,callback) {
	var req=data.req;
	var name=req.query.name;
	var id=req.query.id;
	var reset_code=gen_pass()
	var phone=req.query.phone;
	var table=req.query.table;
	//console.log(reset_code)
	var q="UPDATE "+table+" SET reset_code=SHA1(?),reset_time=now() WHERE id=?"
	var arr=[reset_code,id]
	connection.query(q,arr,function () {
		var msg="Your reset code is "+reset_code
		send_sms(phone,msg)
		callback()
	})
}
function reset_password(data,callback) {
	var req=data.req;
	var id=req.query.id
	var password=req.query.password;
	var table=req.query.table;

	var q="UPDATE "+table+" SET password=SHA1(?) WHERE id=?"
	var arr=[password,id]
	connection.query(q,arr,function (err,rst) {
		callback()
	})
}
function register_user(data,callback) {
	var req=data.req;
	var name=req.query.name;
	var phone=req.query.phone
	var reset_code=gen_pass()
	//console.log(reset_code)
	var q="SELECT *FROM customers WHERE phone=?"
	connection.query(q,[phone],function (err,rst) {
		if(rst&&rst.length){
			var act=rst[0].status
			var id=rst[0].id;
			if(act==0){
				q="UPDATE customers SET name=?,reset_code=SHA1(?),reg_date=now(),reset_time=now() WHERE id=?"
				var arr=[name,reset_code,id]
			}
			else{
				//user exists
				data.errmsg="There's an account already using that phone number"
				return callback()
			}
		}
		if(rst.length==0){
			var q="INSERT INTO customers(name,phone,reset_code) VALUES (?,?,SHA1(?))"
			var arr=[name,phone,reset_code];
		}
		connection.query(q,arr,function (err,rst) {
			if(err)
				console.log(err.sqlMessage)
			callback()
			var msg="Your reset code is "+reset_code
			send_sms(phone,msg)
		})
	})
}
function gen_pass() {
  
   var result           = '';
   var characters       = '123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
const querystring = require('querystring');
const http=require("http");
function send_sms(phone,msg) {
	phone="256"+phone.substring(1,phone.length)
	
	const parameters = {
	  number:phone,
	  message:msg,
	  username:"transpay",
	  password:"beloved@1",
	  sender:"PMS"

	}
	const get_request_args = querystring.stringify(parameters);
	const options = {
	  hostname: "egosms.co",
	  port:80,
	  path: "/api/v1/plain/?" + get_request_args,
	  method: 'GET'
	}

	const request = http.request(options, (response) => {
	  // response from server
	 
	});

	// In case error occurs while sending request
	request.on('error', (error) => {
	  console.log(error.message);
	});

	request.end();
}

function process_payment(argument) {
	
	const https = require('https')

	const data = JSON.stringify({
	  identificationMethod:"Username",
	  user:'Latigo'

	})
	const options = {
	  hostname: 'api.transpayug.com',
	  port: 443,
	  path: '/bank/equity/userInfo/',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': data.length,
	    'bank':"VnQvU1F3UDJlb2dHZXpOWUR3TWM4dz09",

	  }
	}

	const req = https.request(options, res => {
	  console.log(`statusCode: ${res.statusCode}`)

	  res.on('data', d => {
	    process.stdout.write(d)
	  })
	})

	req.on('error', error => {
	  console.error(error)
	})

	req.write(data)
	req.end()
}