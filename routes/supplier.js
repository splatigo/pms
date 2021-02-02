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
	var ajax=req.query.ajax;
	
	if(req.cookies.user&&req.cookies.user!="0")
		req.user=req.cookies.user;
	
	if(!req.user){
		if(ajax){
			return res.send({errmsg:"Please login to access this portal"})
		}
		else
			return res.redirect("/")
	}
	else if(req.user.priv!="supplier"){
		if(ajax){
			return res.send({errmsg:"You need to have a supplier account"})
		}
		else{
			if(req.user.priv=="admin")
				return res.redirect("/admin")
			if(req.user.priv=="gm")
				return res.redirect("/group")
			if(req.user.priv=="customer")
				return res.redirect("/market")
			return res.redirect("/")
		}
	}
	data.user=req.user;
	res.cookie("user",req.user,{maxAge: 15*60*1000})
	data.me=req.user

	if(rq=="get-defaults"){
		db.get_mygroups(data,function () {
			get_dashboard_data(data,function(){
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="get-chicken-orders"){
		get_chicken_orders(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="add-stock"){
		add_stock(data,function(){
			get_stock(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="change-chicken-stock-status"){
		change_chicken_stock_status(data,function(){
			get_stock(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="edit-stock"){
		edit_stock(data,function(){
			get_stock(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="get-stock"){
		get_stock(data,function (argument) {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="change-chicken-order-status"){
		change_chicken_order_status(0,data,function () {
			get_chicken_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else
		res.render("supplier",data)
}

function get_dashboard_data(data,callback) {
	
	get_chicken_orders_summary(data,function (argument) {
		get_stock_sum(data,function () {
			callback()
		})
		
	})

}

function change_chicken_order_status(i,data,callback) {
	var req=data.req;
	var oid=req.query.oid
	if(i==oid.length)
		return callback()
	var req=data.req;
	var status=req.query.status;
	var id=oid[i]
	var supplier_id=req.user.id
	var order_no=id;
	var phone=""
	var message=status
	var method=""
	db.update_chicken_order_status(order_no,status,phone,message,method,supplier_id,function(){
		change_chicken_order_status(++i,data,callback)
	})

}
function get_chicken_orders_summary(data,callback) {
	var req=data.req;
	var supplier_id=req.user.id;
	var q="SELECT SUM(amount) AS amount,SUM(qty) AS qty,count(*) AS no,status FROM chicken_orders WHERE supplier_id=? GROUP BY status"
	connection.query(q,[supplier_id],function (err,rst) {
		if(err)
			console.log(err)
		data.chicken_orders_sum=rst;
		callback()
	})
}

function get_chicken_orders(data,callback) {
	var req=data.req;
	var status=req.query.status
	var supplier_id=req.user.id;
	var q="SELECT chicken_orders.id,order_no,group_name,group_no,groups.id AS group_id,qty,amount,phone,method,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time,time_recorded,status FROM chicken_orders,groups WHERE chicken_orders.group_id=groups.id AND chicken_orders.status=? AND supplier_id=? ORDER BY time_recorded DESC"
	var arr=[status,supplier_id]
	connection.query(q,arr,function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		data.orders=rst;
		callback()
	})
}

function get_stock(data,callback) {
	var req=data.req;
	var supplier_id=req.user.id
	var q="SELECT id,stock_no,qty,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS tr,DATEDIFF(now(),time_recorded) AS age,status FROM chicken_stock WHERE supplier_id=? AND status!='Deleted' ORDER BY time_recorded DESC"
	connection.query(q,[supplier_id],function (err,rst) {
		data.stock=rst;
		if(err)
			return console.log(err.sqlMessage)

		
		callback()
	})
}
function get_stock_sum(data,callback) {
	var req=data.req;
	var supplier_id=req.user.id
	var status="Ready for Sale"
	var ostatus="Under Brooding"
	var q="UPDATE chicken_stock SET status=? WHERE DATEDIFF(now(),time_recorded)>=60 AND status=?"
	connection.query(q,[status,ostatus],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		var q="SELECT SUM(qty) AS qty,status FROM chicken_stock WHERE supplier_id=? GROUP BY status"
		connection.query(q,[supplier_id],function (err,rst) {


			if(err)
				return console.log(err.sqlMessage)

			data.stock_sum=rst;

			callback()
		})
	})
}
function add_stock(data,callback){
	var req=data.req;
	var supplier_id=req.user.id
	var stock_no=db.gen_random()
	var qty=req.query.qty;
	var status="Under Brooding"
	var q="INSERT INTO chicken_stock(stock_no,supplier_id,qty,status) VALUES(?,?,?,?)"
	connection.query(q,[stock_no,supplier_id,qty,status],function(err,rst){
		if(err)
			return console.log(err.sqlMessage)
		callback()
	})
}
function change_chicken_stock_status(data,callback) {
	var req=data.req;
	var id=req.query.id;
	var status=req.query.status

	var q="UPDATE chicken_stock SET status=? WHERE id=?"
	connection.query(q,[status,id],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		q="INSERT INTO chicken_stock_status(stock_id,status) VALUES(?,?)"
		connection.query(q,[id,status],function (err,rst) {
			if(err)
				console.log(err.sqlMessage,"222")
			else
				callback()
		})
		
	})
}
function edit_stock(data,callback) {
	var req=data.req;
	var id=req.query.id;
	var qty=req.query.qty;

	var q="UPDATE chicken_stock SET qty=? WHERE id=?"
	connection.query(q,[qty,id],function (err,rst) {
		// body...
		if(err)
			return console.log(err.sqlMessage)
		callback()
	})
}


