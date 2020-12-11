var crypto=require("crypto")
var db=require("./db")
var mysql=require("mysql")
var db_url=db.db_url;
var db_url=db.db_url
var db_user=db.db_user
var db_host=db.db_host
var db_pass=db.db_pass
var log_data=db.log_data;
var get_mygroups=db.get_mygroups;
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
	var ajax=req.query.ajax;
	if(req.cookies.user&&req.cookies.user!="0")

		req.user=req.cookies.user;
	data.me=req.user;
	if(!req.user){
		if(ajax){
			return res.send({errmsg:"Please login to access this portal"})
		}
		else
			return res.redirect("/")
	}
	if(rq=="create-group"){
		create_group(data)
	}
	else if(rq=="make-purchase"){
		make_purchase(data,function () {
			data.req=0;data.res=0;
			db.get_instock(data,function () {
				res.send(data)
			})
			
		})
	}
	else if(rq=="get-user"){
		db.get_user(req.query.phone,function (user) {
			data.user=user
			data.res=0;data.req=0;
			data.user=user;
			res.send(data)
		});
	}

	else if(rq=="get-defaults"){
		get_mygroups(data,function () {
			db.get_instock(data,function () {
				get_price(data,function () {
					data.req=0;data.res=0;
					res.send(data)
				})
				
			})
			
		})
	
	}
	else if(rq=="get-orders"){
		get_orders(data,function () {
			data.req=0;data.res=0;
			res.send(data)
		})
	}
	
	else if(rq=="get-groups"){
		get_groups(data,function () {
			data.req=0;data.res=0
			res.send(data)
		})
	}
	else{
		res.render("market",data)
		
		
	}
}
function make_purchase(data,callback) {
	// body...
	var req=data.req;
	var userid=req.user.id;
	var trays=req.query.qty;
	var amount=req.query.total
	var method=req.query.method;
	db.get_instock(data,function () {
		if(data.instock<trays||data.instock==0){
			data.errmsg="Sorry, we have only "+(data.instock)+" trays left in stock"
			return callback()
		}

		place_order(userid,trays,amount,method,function (order_id) {
			var payment_ref=new Date().getTime()
			var q="UPDATE egg_orders SET payment_ref=? WHERE id=?"
			connection.query(q,[payment_ref,order_id],function (err,rst) {
				if(err)
					console.log(err.sqlMessage)
				callback()
			})
			
		})
	})
}
function place_order(userid,trays,amount,method,callback) {

	var order_no=gen_order_no()
	trays=trays*30
	var q="INSERT INTO egg_orders(customer_id,order_no,trays,amount,method) VALUES(?,?,?,?,?)"
	connection.query(q,[userid,order_no,trays,amount,method],function (err,rst) {
		if(err){
			if(err.errno==1062){
				place_order(userid,trays,amount,method,callback)
			}
			else
				console.log(err.sqlMessage)
		}
		else{

			var order_id=rst.insertId;

			callback(order_id)
		}

	})
}
function get_price(data,callback) {
	var q="SELECT *FROM settings"
	connection.query(q,function (err,rst) {
		data.price=rst[0].selling_price;
		callback()
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
function gen_order_no() {
  
   var result           = '';
   var characters       = '123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 10; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}



function get_orders(data,callback) {
	var req=data.req;
	var status=req.query.status
	var q="SELECT order_no,trays/30 AS trays, amount,status, method,DATE_FORMAT(order_time,'%c %b %Y %l:%i %p') AS order_time,order_time AS ot FROM egg_orders WHERE customer_id=? ORDER BY ot DESC"
	connection.query(q,[req.user.id],function (err,rst) {
		data.orders=rst;
		callback()
	})
}



















