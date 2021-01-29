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
	else if(rq=="get-chicken-order-bd"){
		get_chicken_order_bd(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="add-stock"){
		add_stock(data,function(){
			get_stock(data,function (argument) {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="delete-stock"){
		delete_stock(data,function(){
			get_stock(data,function (argument) {
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
	else if(rq=="change-supply-order-status"){
		change_supply_orders_status(0,data,function () {
			get_supply_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else
		res.render("supplier",data)
}

function get_dashboard_data(data,callback) {
	
	get_supply_orders_summary(data,function (argument) {
		get_stock_sum(data,function () {
			callback()
		})
		
	})

}

function change_supply_orders_status(i,data,callback) {
	var req=data.req;
	var oid=req.query.oid
	if(i==oid.length)
		return callback()
	var req=data.req;
	var status=req.query.status;
	var id=oid[i]
	var supplier_id=req.user.id
	if(supplier_id){
		supplier_id=supplier_id
		var q="UPDATE chicken_payments SET status=?,supplier_id=? WHERE id=?"
		var arr=[status,supplier_id,id]
	}
	else{
		var q="UPDATE chicken_payments SET status=? WHERE id=?"
		var arr=[status,id]
	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			console.log(err)
		var q="INSERT INTO supply_order_status (order_id,status) VALUES (?,?)"
		connection.query(q,[id,status])
		change_supply_orders_status(++i,data,callback)
	})
}
function get_supply_orders_summary(data,callback) {
	var req=data.req;
	var supplier_id=req.user.id;
	var q="SELECT SUM(amount) AS amount,SUM(qty) AS qty,count(*) AS no,status FROM chicken_payments WHERE supplier_id=? GROUP BY status"
	connection.query(q,[supplier_id],function (err,rst) {
		if(err)
			console.log(err)
		data.supply_orders_sum=rst;

		callback()
	})
}

function get_chicken_orders(data,callback) {
	var req=data.req;
	var status=req.query.status
	var supplier_id=req.user.id;

	var q="SELECT chicken_payments.id,order_no,group_name,group_no,groups.id AS group_id,qty,amount,phone,method,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time,time_recorded,status FROM chicken_payments,groups WHERE chicken_payments.group_id=groups.id AND chicken_payments.status=? AND supplier_id=? ORDER BY time_recorded DESC"
	var arr=[status,supplier_id]
	connection.query(q,arr,function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		data.orders=rst;

		callback()
	})
}
function get_chicken_order_bd(data,callback) {
	var req=data.req;
	var group_id=req.query.group_id
	var group_order_no=req.query.group_order_no
	var q="SELECT supply_orders.id,order_no,supply_orders.status,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS time_recorded,time_recorded AS ordered_on,qty,(price*qty) AS amount,name AS member_name,DATE_FORMAT(time_received,'%e %b %Y %l:%i %p') AS tr,age,DATEDIFF(DATE_ADD(now(),INTERVAL 8 HOUR),time_received) AS age2  FROM supply_orders,group_members WHERE group_members.group_id=? AND group_members.id=supply_orders.member_id AND group_order_no=? ORDER BY ordered_on DESC"
		var arr=[group_id,group_order_no]
	connection.query(q,arr,function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.orders_bd=rst;
		callback()
	})
}
function get_stock(data,callback) {
	var req=data.req;
	var supplier_id=req.user.id
	var q="SELECT id,stock_no,qty,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS tr,DATEDIFF(now(),time_recorded) AS age,status FROM chicken_stock WHERE supplier_id=? ORDER BY time_recorded DESC"
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

	var q="INSERT INTO chicken_stock(stock_no,supplier_id,qty) VALUES(?,?,?)"
	connection.query(q,[stock_no,supplier_id,qty],function(err,rst){
		if(err)
			return console.log(err.sqlMessage)
		callback()
	})
}
function delete_stock(data,callback) {
	var req=data.req;
	var id=req.query.id;
	var q="DELETE FROM chicken_stock WHERE id=?"
	connection.query(q,[id],function (err,rst) {
		// body...
		if(err)
			return console.log(err.sqlMessage)
		callback()
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


