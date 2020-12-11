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
		else
			return res.redirect("/market")
	}
	data.user=req.user;
	data.me=req.user

	if(rq=="get-defaults"){
		db.get_mygroups(data,function () {
			get_dashboard_data(data,function(){
				data.res=0;data.req=0;
				res.send(data)
			})
			
		})
	}
	else if(rq=="get-supply-orders"){
		get_supply_orders(data,function () {
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
		callback()
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
		var q="UPDATE supply_orders SET status=?,supplier_id=? WHERE id=?"
		var arr=[status,supplier_id,id]
	}
	else{
		var q="UPDATE supply_orders SET status=? WHERE id=?"
		var arr=[status,id]
	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			console.log(err)
		change_supply_orders_status(++i,data,callback)
	})
}
function get_supply_orders_summary(data,callback) {
	var req=data.req;
	var supplier_id=req.user.id;
	var q="SELECT SUM(price*qty) AS amount,SUM(qty) AS qty,count(*) AS no,status FROM supply_orders WHERE supplier_id=? GROUP BY status"
	connection.query(q,[supplier_id],function (err,rst) {
		if(err)
			console.log(err)
		data.supply_orders_sum=rst;
		callback()
	})
}

function get_supply_orders(data,callback) {
	var req=data.req;
	var status=req.query.status
	var supplier_id=req.user.id;
	var q="SELECT supply_orders.id,order_no,group_name,group_no,name AS member_name,group_members.phone AS member_phone, qty,(qty*price) AS amount,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS order_time,time_recorded FROM supply_orders,group_members,groups WHERE supply_orders.member_id=group_members.id AND supply_orders.group_id=groups.id AND supply_orders.status=? AND supplier_id=? ORDER BY time_recorded DESC"
	connection.query(q,[status,supplier_id],function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		data.orders=rst;
		console.log(rst)
		callback()
	})
}