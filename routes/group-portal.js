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
			return res.send({errmsg:"Your Session expired",et:"session-expired"})
		}
		else
			return res.redirect("/")
	}
	else if(req.user.priv!="gm"){
		if(ajax){
			return res.send({errmsg:"You have no priviledge to access a group member account"})
		}
		else{

			if(req.user.priv=="admin")
				return res.redirect("/admin")
			if(req.user.priv=="supplier")
				return res.redirect("/supplier")
			if(req.user.priv=="customer")
				return res.redirect("/market")
		}
	}
	data.user=req.user;
	res.cookie("user",req.user,{maxAge: 15*60*1000})
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
	else if(rq=="upload-order-form"){
		upload_order_form(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="get-group-orders"){
		get_group_orders(data,function(){
			data.res=0;data.req=0;
			res.send(data)
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
		get_group_orders(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="view-order-breakdown"){
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
			get_group_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="receive-order"){
		receive_order(data,function () {
			get_group_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="add-order"){
		data.group_order_no=db.gen_random()	
		complete_payment(data,function () {
			add_order(0,data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="retry-paying"){
		data.group_order_no=req.query.order_no
		complete_payment(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="check-chicken-order-payment-status"){
		var order_no=req.query.order_no;
		var phone=req.query.phone;
		var pd=[{order_no:order_no,phone:phone}]
		
		check_chicken_order_payment_status(0,data,pd,function(){
			data.res=0;data.req=0;
			res.send(data)
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
	else if(rq=="topup-wallet"){
		var phone=req.query.phone;
		var account_no="GM"+req.user.member_no
		var amount=req.query.amount;
		var type="Credit"
		var description="Mobile Money Topup via "+phone
		var status="Pending"
		var trans_id=db.gen_random(15)

		var wd=[account_no,amount,type,description,status,trans_id]
		db.update_wallet(wd,function () {
			var parameters={
			    "phone":phone,
			    "amount":amount,
			    "msg":trans_id,
			    "user":"2341166770"
		  	}
		  	data.parameters=parameters
			db.mm_topup(data,function () {
				db.wallet_transactions(data,function () {
					db.get_wallet(data,function () {
						data.req=0;data.res=0
						res.send(data)
					})
				})
				
			})
		})
	}
	else if(rq=="wallet-transactions"){
		db.wallet_transactions(data,function () {
			db.get_wallet(data,function () {
				data.req=0;data.res=0
				res.send(data)
			})
		})
	}
	
	else if(rq=="get-defaults"){

		db.get_districts(data,function () {
			get_mygroups(data,function () {
				db.get_group_members(group_id,function (rst) {
					db.get_group_details(data,function () {
						get_stock_summary(data,function () {
							get_orders_summary(data,function () {
								get_cs_sum(data,function (argument) {
									db.get_settings(data,function(){
										db.get_wallet(data,function (argument) {
												data.group_members=rst;data.req=0;data.res=0
											res.send(data)
										})
										
									})
								})
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
function complete_payment(data,callback) {
	var req=data.req;
	var phone=req.query.phone;
  	var order_no=data.group_order_no
  	data.order_no=order_no
  	data.phone=phone
  	var amount=req.query.tamount
  	var qty=req.query.tqty;
  	var no=req.query.no;//no of orders

  	if(req.query.method=="mm")
  		method="Mobile Money"
  	else{
  		phone=""
  		method="Wallet"
  	}
  	var group_id=req.user.group_id
  	data.order_err=0
  	var no=req.query.no
  	var member_id=req.user.id;
  	var q="INSERT INTO chicken_payments(group_id,member_id,order_no,qty,amount,phone,method,no) VALUES(?,?,?,?,?,?,?,?)"
  	var arr=[group_id,member_id,order_no,qty,amount,phone,method,no]
  	if(req.query.rq=="retry-paying"){

  		q="UPDATE chicken_payments SET status='Pending Approval',phone=?,method=? WHERE order_no=?"
  		arr=[phone,method,order_no]
  	}

  	connection.query(q,arr,function (err,rst) {
  		if(err)
  			console.log(err.sqlMessage)
  		
  		var status="Pending Approval"
		if(req.query.method=="wallet"){
			db.get_wallet(data,function () {
				if(data.wallet<amount){
					data.order_err="Wallet balance is less than payment amount"
					data.status="Failed"
					db.update_payment_status(order_no,'Failed',phone,data.order_err,'Wallet',0,callback)
				}
				else{
					var account_no="GM"+req.user.member_no
					var type="Debit"
					var description="Payment for Chicken, order No: "+order_no
					var status="Completed"
					var trans_id=db.gen_random(15);
					var wd=[account_no,amount,type,description,status,trans_id]
					db.update_wallet(wd,function () {
						data.status="Pending Delivery"
						db.update_payment_status(order_no,'Pending Delivery',phone,'Payment Completed','Wallet',0,callback)
					})
				}
				
			})
		}
		else{
			var account_no="GM"+req.user.member_no
			var type="Credit"
			var description="Mobile Money Topup via "+phone
			var status="Pending"
			var trans_id=order_no
			var parameters={
			    "phone":phone,
			    "amount":amount,
			    "msg":trans_id,
			    "user":"2341166770"
		  	}

		  	data.parameters=parameters
			db.mm_topup(data,function (err) {
				var status="Pending Approval"
				var description='Pending Approval and Payment';

				if(err){
					status="Failed"
					data.order_err=err;
					description=err;

				}
				data.status=status;
				
				db.update_payment_status(order_no,status,phone,description,'Mobile Money',0,callback)
			})
		}
		
	})
}

function check_chicken_order_payment_status(i,data,pd,callback){

	if(i==pd.length){
		return callback()
	}

	var order_no=pd[i].order_no;
	var phone=pd[i].phone;
	
	
	var parameters={
	    "phone":phone,
	    "msg":order_no,
	    "user":"2341166770"
  		}

  	data.parameters=parameters;

	db.check_mm_status(data,function(r,status,msg){
		
		if(r==0){
			if(status=="ETIMEDOUT"){
				var status="Pending Approval"
				callback();
			}
			else{
				var status="Pending Approval"
				data.status=status
				check_chicken_order_payment_status(++i,data,pd,callback)
			}
		}

		else if(r==1){
			if(status=="FAILED"||status==0){
				data.order_err=msg;
				status="Failed"
			}
			else{
				msg="Payment Completed"
				status='Pending Delivery'

			}
			data.status=status

			db.update_payment_status(order_no,status,phone,msg,'Mobile Money',0,function () {
				check_chicken_order_payment_status(++i,data,pd,callback)
			})
		}

			
	})
}
function upload_order_form(data,callback) {
	var req=data.req;
	var form_photo=req.files.form_photo;
	var file_name=req.body.file_name
	db.upload_photo(form_photo,"forms","form-"+file_name)
	callback()
}
function record_chicken_status(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id;
	var member_id=req.query.member_id;
	var healthy=req.query.healthy;
	var sick=req.query.sick;
	var dead=req.query.dead;
	var sold=req.query.sold
	var healthy_nl=req.query.healthy_nl;
	var sick_nl=req.query.sick_nl;
	var dead_nl=req.query.dead_nl;
	var sold_nl=req.query.sold_nl
	var q="UPDATE chicken_status SET latest=0 WHERE group_id=? AND member_id=?"
	connection.query(q,[group_id,member_id],function(err,rst){
		var q="INSERT INTO chicken_status(group_id,member_id,healthy,sick,dead,sold,healthy_nl,sick_nl,dead_nl,sold_nl,latest) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
		connection.query(q,[group_id,member_id,healthy,sick,dead,sold,healthy_nl,sick_nl,dead_nl,sold_nl,1],function (err,rst) {
			
			if(err)
				return console.log(err)
			callback()
		})
	})
}
function get_group_orders(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id;
	get_chicken_orders_by_status(data,'Pending Approval',function(rst){
		check_chicken_order_payment_status(0,data,rst,function(){
			get_chicken_orders_by_status(data,0,function(rst){
				data.group_orders=rst;
				callback()
			})
			
		})
		
	})
}

function get_chicken_orders_by_status(data,status,callback){
	var req=data.req;
	var group_id=req.user.group_id;
	if(status==0)
		var q="SELECT order_no,no,qty,amount AS total,phone,status,message,method,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time FROM chicken_payments WHERE group_id=? ORDER BY time_recorded DESC"

	else
		var q="SELECT order_no,no,qty,amount AS total,phone,status,message,method,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time FROM chicken_payments WHERE group_id=? AND status=? ORDER BY time_recorded DESC"
	connection.query(q,[group_id,status],function(err,rst){
		if(err)
			console.log(err.sqlMessage)

		callback(rst)
	})
}
function edit_chicken_status(data,callback) {
	var req=data.req;
	var id=req.query.id;
	var member_id=req.query.member_id;
	var healthy=req.query.healthy;
	var sick=req.query.sick;
	var dead=req.query.dead;
	var sold=req.query.sold
	var healthy_nl=req.query.healthy_nl;
	var sick_nl=req.query.sick_nl;
	var dead_nl=req.query.dead_nl;
	var sold_nl=req.query.sold_nl
	var q="UPDATE chicken_status SET member_id=?,healthy=?,sick=?,dead=?,sold=?,healthy_nl=?,sick_nl=?,dead_nl=?,sold_nl=? WHERE id=?"
	connection.query(q,[member_id,healthy,sick,dead,sold,healthy_nl,sick_nl,dead_nl,sold_nl,id],function (err,rst) {
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
		var q="SELECT chicken_status.id,member_id,healthy,sick,dead,sold,healthy_nl,sick_nl,dead_nl,sold_nl,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS time_recorded,time_recorded AS tr,group_members.name AS member_name FROM chicken_status,group_members WHERE chicken_status.member_id=group_members.id AND chicken_status.group_id=? ORDER BY tr DESC"
		var arr=[group_id]
	}
	else{
		var q="SELECT chicken_status.id,member_id,healthy,sick,dead,healthy_nl,sick_nl,dead_nl,sold_nl,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS time_recorded,time_recorded AS tr,group_members.name AS member_name FROM chicken_status,group_members WHERE chicken_status.member_id=group_members.id AND chicken_status.group_id=? AND chicken_status.member_id=? ORDER BY tr DESC"
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
function get_cs_sum(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	if(req.user.role=="Chairperson"){
		var q="SELECT SUM(healthy) AS healthy,sum(sick) AS sick, SUM(dead) AS dead,SUM(sold) AS sold,SUM(healthy_nl) AS healthy_nl,sum(sick_nl) AS sick_nl, SUM(dead_nl) AS dead_nl,SUM(sold_nl) AS sold_nl FROM chicken_status WHERE latest=1 AND group_id=?"
		var arr=[group_id]
	}
	else{
		var q="SELECT SUM(healthy) AS healthy,sum(sick) AS sick, SUM(dead) AS dead,SUM(sold) AS sold,SUM(healthy_nl) AS healthy_nl,sum(sick_nl) AS sick_nl, SUM(dead_nl) AS dead_nl,SUM(sold_nl) AS sold_nl FROM chicken_status WHERE latest=1 AND group_id=? AND member_id=?"
		var arr=[group_id,req.user.id]
	}
	
	connection.query(q,arr,function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.cs_sum=rst;
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
			q="INSERT INTO egg_stock_status(order_id,status) VALUES(?,?)"
			connection.query(q,[rst.insertId,'Pending Approval'])
			callback()
		})
	})
}
function remove_order(data,callback) {
	var req=data.req;
	var id=req.query.id;
	
	var q="DELETE FROM supply_orders WHERE id=?"
	connection.query(q,[id],function (err) {
		if(err)
			console.log(err.sqlMessage)
		callback()
	})
}
function receive_order(data,callback) {
	var req=data.req;
	var id=req.query.id;
	var age=req.query.age
	var q="UPDATE supply_orders SET time_received=DATE_ADD(now(),INTERVAL 8 HOUR),age=? WHERE id=?"
	connection.query(q,[age,id],function (err) {
		if(err)
			console.log(err.sqlMessage)
		callback()
	})
}
function add_order(i,data,callback) {

	var req=data.req;
	var group_id=req.user.group_id
	var qty=req.query.qty
	if(i==qty.length)
		return callback()
	qty=qty[i];
	var order_no=db.gen_random()
	var member_id=req.query.member_id[i]
	var price=req.query.price
	var group_order_no=data.group_order_no
	var status=data.status
	var q="INSERT INTO supply_orders(group_id,qty,order_no,group_order_no,price,member_id,status) VALUES (?,?,?,?,?,?,?)"
	connection.query(q,[group_id,qty,order_no,group_order_no,price,member_id,status],function (err,rst) {
		if(err)
			console.log(err.sqlMessage)

		add_order(++i,data,callback)
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
		var q="SELECT DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS time_recorded,time_recorded AS posted_on,trays,egg_stock.id,price,(price*trays) AS amount,stock_no,egg_stock.status,name AS member_name FROM egg_stock,group_members WHERE egg_stock.group_id=? AND group_members.id=egg_stock.member_id ORDER BY posted_on DESC"
	else{
		var member_id=req.user.id;
		var q="SELECT DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS time_recorded,time_recorded AS posted_on,trays,egg_stock.id,price,(price*trays) AS amount,stock_no,egg_stock.status,name AS member_name FROM egg_stock,group_members WHERE egg_stock.group_id=? AND member_id=? AND group_members.id=egg_stock.member_id ORDER BY posted_on DESC"
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
	var group_order_no=req.query.group_order_no
	if(req.user.role=="Chairperson"){		
		var q="SELECT supply_orders.id,order_no,supply_orders.status,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS time_recorded,time_recorded AS ordered_on,qty,(price*qty) AS amount,name AS member_name,DATE_FORMAT(time_received,'%e %b %Y %l:%i %p') AS tr,age,DATEDIFF(DATE_ADD(now(),INTERVAL 8 HOUR),time_received) AS age2  FROM supply_orders,group_members WHERE group_members.group_id=? AND group_members.id=supply_orders.member_id AND group_order_no=? ORDER BY ordered_on DESC"
		var arr=[group_id,group_order_no]
	
	}
	else{
		var q="SELECT supply_orders.id,order_no,supply_orders.status,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS time_recorded,time_recorded AS ordered_on,qty,(price*qty) AS amount,name AS member_name,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS tr,age,DATEDIFF(DATE_ADD(now(),INTERVAL 8 HOUR),time_received) AS age2 FROM supply_orders,group_members  WHERE group_members.group_id=? AND member_id=? AND group_members.id=supply_orders.member_id ORDER BY ordered_on DESC"
		var arr=[group_id,group_order_no,req.user.id]

	}

	connection.query(q,arr,function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.orders=rst;
		callback()
	})
}






















