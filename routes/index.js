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
	else
		res.render("index",data)
}
function verify_code(data,callback) {
	var req=data.req;
	var reset_code=req.query.reset_code
	var phone=req.query.phone
	var q="SELECT *FROM users WHERE phone=? AND reset_code=SHA1(?)"
	connection.query(q,[phone,reset_code],function (err,rst) {
		
		if(rst&&rst.length){
			//verified; correct
			var id=rst[0].id;
			var password=gen_pass()
			q="UPDATE users SET status=1,password=SHA1(?) WHERE id=?"
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
	var phone=req.query.phone
	var reset_code=gen_pass()
	console.log(reset_code)
	var q="UPDATE users SET reset_code=SHA1(?),reset_time=now() WHERE phone=?"
	var arr=[reset_code,phone]
	connection.query(q,arr,function () {
		callback()
	})
}
function reset_password(data,callback) {
	var req=data.req;
	var phone=req.query.phone
	var password=req.query.password;
	var q="UPDATE users SET password=SHA1(?) WHERE phone=?"
	var arr=[password,phone]
	connection.query(q,arr,function (err,rst) {
		
		callback()
	})
}
function register_user(data,callback) {
	var req=data.req;
	var name=req.query.name;
	var phone=req.query.phone
	var reset_code=gen_pass()
	console.log(reset_code)
	var q="SELECT *FROM users WHERE phone=?"
	connection.query(q,[phone],function (err,rst) {
		if(rst&&rst.length){
			var act=rst[0].status
			var id=rst[0].id;
			if(act==0){
				q="UPDATE users SET name=?,reset_code=SHA1(?),reg_date=now(),reset_time=now() WHERE id=?"
				var arr=[name,reset_code,id]
			}
			else{
				//user exists
				data.errmsg="There's an account already using that phone number"
				return callback()
			}
		}
		if(rst.length==0){
			var q="INSERT INTO users(name,phone,reset_code) VALUES (?,?,SHA1(?))"
			var arr=[name,phone,reset_code];
		}
		connection.query(q,arr,function (err,rst) {
			if(err)
				console.log(err.sqlMessage)
			callback()
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