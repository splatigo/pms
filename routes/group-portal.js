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
	var rt="query"
	if(req.method=="POST"){
		rq=req.body.rq;
		ajax=req.body.ajax
		var rt="body"
	}
	if(req.cookies.user&&req.cookies.user!="0")
		req.user=req.cookies.user;

	if(!req.user){
		if(ajax){
			return res.send({errmsg:"Please login to access this portal"})
		}
		else
			return res.redirect("/market")
	}
	else if(req.user.priv!="gm"){
		if(ajax){
			return res.send({errmsg:"You have no priviledge to access a group member account"})
		}
		else
			return res.redirect("/market")
	}
	data.user=req.user;
	data.me=req.user
	var group_id=req.user.group_id
	data.group_id=group_id
	req.body.group_id=group_id
	req.query.group_id=group_id
	if(rq=="add-group-member"){
		var role=req[rt].role;
		db.add_group_member(data,function () {
			db.get_group_members(group_id,function (rst) {
				data.res=0;data.req=0;
				data.group_members=rst;
				res.send(data)
			})
		})
		
	}
	else if(rq=="edit-group-member"){
		db.edit_group_member(data,function () {
			db.get_group_members(group_id,function (rst) {
				data.res=0;data.req=0;
				data.group_members=rst;
				res.send(data)
			})
		})
		
	}
	else if(rq=="get-members"){
		var group_id=req.user.group_id
		db.get_group_members(group_id,function (rst) {
			data.res=0;data.req=0;
			data.group_members=rst;
			res.send(data)
		})
	}
	
	else if(rq=="remove-member"){
		db.remove_member(data,function (a) {
			var group_id=req.user.group_id
			db.get_group_members(group_id,function (rst) {
				data.res=0;data.req=0;
				data.group_members=rst;
				res.send(data)
			})
		})
	}

	else if(rq=="change-role"){
		db.change_role(data,function () {
			var group_id=req.user.group_id
			db.get_group_members(group_id,function (rst) {
				data.res=0;data.req=0;
				data.group_members=rst;
				res.send(data)
			})
		})
	}
	else if(rq=="view-egg-stock"){
		view_egg_stock(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="view-orders"){
		view_supply_orders(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	
	else if(rq=="add-stock"){
		add_stock(data,function () {
			view_egg_stock(data,function () {
				get_stock_summary(data,function () {
					data.res=0;data.req=0;
					res.send(data)
				})
			})
		})
	}
	else if(rq=="edit-stock"){
		edit_stock(data,function () {
			view_egg_stock(data,function () {
				get_stock_summary(data,function () {
					data.res=0;data.req=0;
					res.send(data)
				})
			})
		})
	}
	else if(rq=="remove-stock"){
		remove_stock(data,function () {
			view_egg_stock(data,function () {
				get_stock_summary(data,function () {
					data.res=0;data.req=0;
					res.send(data)
				})
			})
		})
	}
	else if(rq=="remove-order"){
		remove_order(data,function () {
			view_supply_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="add-order"){
		add_order(data,function () {
			view_supply_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
				
			})
		})
	}
	else if(rq=="edit-order"){
		edit_order(data,function () {
			view_supply_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
				
			})
		})
	}
	else if(rq=="remove-stock"){
		remove_order(data,function () {
			view_supply_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="get-chicken-status"){
		get_chicken_status(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="new-cs"){
		record_chicken_status(data,function(){
			get_chicken_status(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="edit-cs"){
		edit_chicken_status(data,function(){
			get_chicken_status(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="remove-cs"){
		remove_chicken_status(data,function(){
			get_chicken_status(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	
	else if(rq=="get-defaults"){

		db.get_districts(data,function () {
			get_mygroups(data,function () {
				db.get_group_members(group_id,function (rst) {
					db.get_group_details(data,function (argument) {
						get_stock_summary(data,function (argument) {
							get_orders_summary(data,function (argument) {
								data.group_members=rst;data.req=0;data.res=0
								res.send(data)
							})
							
						})
						
					})
					
				})
			})
		})
	}

	else{

		res.render("group-portal",data)
	}
}
function record_chicken_status(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id;
	var member_id=req.query.member_id;
	var healthy=req.query.healthy;
	var sick=req.query.sick;
	var dead=req.query.dead;
	var year=req.query.year;
	var month=req.query.month;
	var week=req.query.week;
	var q="INSERT INTO chicken_status(group_id,member_id,healthy,sick,dead,year,month,week) VALUES (?,?,?,?,?,?,?,?)"
	connection.query(q,[group_id,member_id,healthy,sick,dead,year,month,week],function (err,rst) {

		if(err)
			return console.log(err)

		callback()
	})
}
function edit_chicken_status(data,callback) {
	var req=data.req;
	var id=req.query.id;
	var member_id=req.query.member_id;
	var healthy=req.query.healthy;
	var sick=req.query.sick;
	var dead=req.query.dead;
	var year=req.query.year;
	var month=req.query.month;
	var week=req.query.week;
	var q="UPDATE chicken_status SET member_id=?,healthy=?,sick=?,dead=?,year=?,month=?,week=? WHERE id=?"
	connection.query(q,[member_id,healthy,sick,dead,year,month,week,id],function (err,rst) {
		if(err)
			return console.log(err)

		callback()
	})
}
function remove_chicken_status(data,callback) {
	var req=data.req;
	var id=req.query.id;
	var q="DELETE FROM chicken_status WHERE id=?"
	connection.query(q,[id],function (err,rst) {
		if(err)
			return console.log(err)
		callback()
	})
}
function get_chicken_status(data,callback) {

	var req=data.req;
	var group_id=req.user.group_id;
	if(req.user.role=="Chairperson"){
		var q="SELECT chicken_status.id,member_id,healthy,sick,dead,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS time_recorded,time_recorded AS tr,group_members.name AS member_name,year,month,week FROM chicken_status,group_members WHERE chicken_status.member_id=group_members.id AND chicken_status.group_id=? ORDER BY tr DESC"
		var arr=[group_id]
	}
	else{
		var q="SELECT chicken_status.id,member_id,healthy,sick,dead,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS time_recorded,time_recorded AS tr,group_members.name AS member_name,year,month,week FROM chicken_status,group_members WHERE chicken_status.member_id=group_members.id AND chicken_status.group_id=? AND chicken_status.member_id=? ORDER BY tr DESC"
		var member_id=req.user.id;
		var arr=[group_id,member_id]
	}
	connection.query(q,arr,function (err,rst) {
		data.chicken_status=rst;
		callback()
	})
}
function get_stock_summary(data,callback) {
	var req=data.req;
	var group_id=data.group_id
	if(req.user.role=="Chairperson"){
		var q="SELECT SUM(price*trays) AS amount,SUM(trays) AS trays,count(*) AS no, status FROM egg_stock WHERE group_id=? GROUP BY status"
		var arr=[group_id]
	}
	else{
		var q="SELECT SUM(price*trays) AS amount,SUM(trays) AS trays,count(*) AS no, status FROM egg_stock WHERE group_id=? AND member_id=? GROUP BY status"
		var arr=[group_id,req.user.id]

	}


	connection.query(q,arr,function (err,rst) {
		data.stock_sum=rst;
		if(err)
			console.log(err.sqlMessage)
		
			callback()	
	})
}
function get_orders_summary(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	
	if(req.user.role=="Chairperson"){
		var q="SELECT SUM(price*qty) AS amount,SUM(qty) AS qty,count(*) AS no,status FROM supply_orders WHERE group_id=? GROUP BY status"
		var arr=[group_id]
	}
	else{
		var q="SELECT SUM(price*qty) AS amount,SUM(qty) AS qty,count(*) AS no,status FROM supply_orders WHERE group_id=? AND member_id=? GROUP BY status"
		var arr=[group_id,req.user.id]


	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		data.orders_sum=rst;

		callback()
	})
}
function remove_stock(data,callback) {
	var req=data.req;
	var id=req.query.id;
	var q="DELETE FROM egg_stock WHERE id=?"
	connection.query(q,[id],function (err) {
		if(err)
			console.log(err.sqlMessage)
		callback()
	})
}


function add_stock(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	var qty=req.query.qty
	var stock_no=db.gen_random()
	var member_id=req.query.member_id
	db.get_settings(data,function () {

		var price=data.settings.buying_price;
		var q="INSERT INTO egg_stock(group_id,trays,stock_no,price,member_id) VALUES (?,?,?,?,?)"
		connection.query(q,[group_id,qty,stock_no,price,member_id],function (err,rst) {
			if(err)
				console.log(err.sqlMessage)
			callback()
		})
	})
}
function remove_order(data,callback) {
	var req=data.req;
	var id=req.query.id;
	console.log(id)
	var q="DELETE FROM supply_orders WHERE id=?"
	connection.query(q,[id],function (err) {
		if(err)
			console.log(err.sqlMessage)
		callback()
	})
}


function add_order(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	var qty=req.query.qty
	var order_no=db.gen_random()
	var member_id=req.query.member_id
	db.get_settings(data,function () {
		var price=data.settings.chicken_price;
		var q="INSERT INTO supply_orders(group_id,qty,order_no,price,member_id) VALUES (?,?,?,?,?)"
		connection.query(q,[group_id,qty,order_no,price,member_id],function (err,rst) {
			if(err)
				console.log(err.sqlMessage)
			callback()
		})
	})
}

function edit_stock(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	var qty=req.query.qty
	var id=req.query.id
	var q="UPDATE egg_stock SET trays=? WHERE id=?"
	connection.query(q,[qty,id],function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		callback()
	})
}
function edit_order(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	var qty=req.query.qty
	var id=req.query.id
	var q="UPDATE supply_orders SET qty=? WHERE id=?"
	connection.query(q,[qty,id],function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		callback()
	})
}
function view_egg_stock(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	var arr=[group_id]
	if(req.user.role=="Chairperson")
		var q="SELECT DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS time_recorded,time_recorded AS posted_on,trays,egg_stock.id,price,(price*trays) AS amount,stock_no,egg_stock.status,name AS member_name FROM egg_stock,group_members WHERE egg_stock.group_id=? AND group_members.id=egg_stock.member_id ORDER BY posted_on DESC"
	else{
		var member_id=req.user.id;
		var q="SELECT DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS time_recorded,time_recorded AS posted_on,trays,egg_stock.id,price,(price*trays) AS amount,stock_no,egg_stock.status,name AS member_name FROM egg_stock,group_members WHERE egg_stock.group_id=? AND member_id=? AND group_members.id=egg_stock.member_id ORDER BY posted_on DESC"
		var arr=[group_id,member_id]
	}
	connection.query(q,arr,function (err,rst) {
		data.egg_stock=rst;
		
		callback()
	})
}
function view_supply_orders(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	if(req.user.role=="Chairperson"){		
		var q="SELECT supply_orders.id,order_no,supply_orders.status,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS time_recorded,time_recorded AS ordered_on,qty,(price*qty) AS amount,name AS member_name FROM supply_orders,group_members WHERE group_members.group_id=? AND group_members.id=supply_orders.member_id ORDER BY ordered_on DESC"
		var arr=[group_id]
	
	}
	else{
		var q="SELECT supply_orders.id,order_no,supply_orders.status,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS time_recorded,time_recorded AS ordered_on,qty,(price*qty) AS amount,name AS member_name FROM supply_orders,group_members WHERE group_members.group_id=? AND member_id=? AND group_members.id=supply_orders.member_id ORDER BY ordered_on DESC"
		var arr=[group_id,req.user.id]

	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.orders=rst;
		callback()
	})
}






















