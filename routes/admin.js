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
	else if(req.user.priv!="admin"&&req.user.priv!="funder"){
		if(ajax){
			return res.send({errmsg:"Account does not have priviledge to access this portal"})
		}
		else{
			if(req.user.priv=="gm")
				return res.redirect("/group")
			if(req.user.priv=="supplier")
				return res.redirect("/supplier")
			if(req.user.priv=="customer")
				return res.redirect("/market")
			
		}
	}
	data.user=req.user;
	res.cookie("user",req.user,{maxAge: 15*60*1000})
	data.me=req.user
	
	if(rq=="get-defaults"){

		db.get_districts(data,function () {
			db.get_mygroups(data,function () {
				get_dashboard_data(data,function () {
					db.get_settings(data,function () {
						get_suppliers(data,function () {
							get_funders(data,function () {
								data.res=0;data.req=0;
								res.send(data)
							})
							
						})
					})
				})
			})
		})
	}
	else if(rq=="get-chicken-stock"){
		get_chicken_stock(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="get-cs"){
		get_cs(data,function(){
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="create-group"){
		create_group(data,function () {
			get_groups(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="edit-group"){
		edit_group(data,function () {
			get_groups(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="remove-group"){
		remove_group(data,function () {
			get_groups(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="get-groups"){
		get_groups(data,function () {

			data.res=0;data.req=0;
			res.send(data)
		})
	}

	else if(rq=="get-group-members"){
		var group_id=req.query.group_id;		
		db.get_group_members(group_id,function (rst) {
			data.group_members=rst;
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="add-group-member"){
		var group_id=req[rt].group_id
		db.add_group_member(data,function () {
			db.get_group_members(group_id,function (rst) {
				data.res=0;data.req=0;
				data.group_members=rst;
				res.send(data)
			})
		})
		
	}
	else if(rq=="edit-group-member"){
		var group_id=req[rt].group_id
		db.edit_group_member(data,function () {
			db.get_group_members(group_id,function (rst) {
				data.res=0;data.req=0;
				data.group_members=rst;
				res.send(data)
			})
		})
		
	}
	
	else if(rq=="remove-member"){
		db.remove_member(data,function (a) {
			var group_id=req.query.group_id
			db.get_group_members(group_id,function (rst) {
				data.res=0;data.req=0;
				data.group_members=rst;
				res.send(data)
			})
		})
	}

	else if(rq=="change-role"){
		db.change_role(data,function () {
			var group_id=req.query.group_id
			db.get_group_members(group_id,function (rst) {
				data.res=0;data.req=0;
				data.group_members=rst;
				res.send(data)
			})
		})
	}
	else if(rq=="create-supplier"){
		create_supplier(data,function () {
			get_suppliers(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="edit-supplier"){
		edit_supplier(data,function () {
			get_suppliers(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="remove-supplier"){
		remove_supplier(data,function () {
			get_suppliers(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="get-suppliers"){
		get_suppliers(data,function () {
			data.res=0;data.req=0;

			res.send(data)
		})
	}
	else if(rq=="get-funders"){
		get_funders(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="create-funder"){
		create_funder(data,function () {
			get_funders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="edit-funder"){
		edit_funder(data,function () {
			get_funders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="remove-funder"){
		remove_funder(data,function () {
			get_funders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
		
	}
	else if(rq=="get-orders"){
		get_orders(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="get-chicken-orders"){
		get_chicken_orders(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="get-chicken-order-breakdown"){
		get_chicken_orders_breakdown(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="get-stock"){
		get_stock(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="change-order-status"){
		change_order_status(0,data,function () {
			get_orders(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
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
	else if(rq=="change-stock-status"){
		change_stock_status(0,data,function () {
			get_stock(data,function () {
				data.res=0;data.req=0;
				res.send(data)
			})
		})
	}
	else if(rq=="set-egg-price"){
		set_egg_price(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else
		res.render("admin",data)
}
function get_funders(data,callback) {

	var q="SELECT *FROM funders ORDER BY id DESC"
	var arr=[]
	var req=data.req;
	if(req.user.priv=="funder")
		arr=[req.user.id]
	connection.query(q,arr,function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.funders=rst;
		callback()
	})
}
function create_funder(data,callback) {
	var res=data.res;
	var req=data.req;
	var phone=req.query.funder_phone;
	var business_name=req.query.funder_name;
	var created_by=req.user.id;
	var address=req.query.address
	var funder_no=db.gen_random(6)
	var email=req.query.funder_email
	var name=""
	var password=db.gen_random(6)
		var table="funders"
	db.check_exists(data,phone,email,table,function(){
		var q="INSERT INTO funders (name,email,phone,password,reset_code,username,funder_no,business_name,created_by) VALUES (?,?,?,SHA1(?),?,?,?,?,?)"
		connection.query(q,[name,email,phone,password,password,funder_no,funder_no,business_name,created_by],function (err,rst) {
			if(err){
				console.log(err.sqlMessage)
				if(err.errno==1062){
					data.errmsg="Email or phone already in use"
					return callback()
				}
				return 0;
			}
			else
				callback()
		})
	})
}
function edit_funder(data,callback) {

	var req=data.req;
	var phone=req.query.funder_phone;
	var business_name=req.query.funder_name;
	var email=req.query.funder_email
	var funder_id=req.query.funder_id

	var q="UPDATE funders SET email=?,phone=?,business_name=? WHERE id=?"
	connection.query(q,[email,phone,business_name,funder_id],function (err,rst) {
		if(err){
			if(err.errno==1062){
				data.errmsg="Email or phone already in use"
				return callback()
			}
			return console.log(err.sqlMessage)

		}
		else{
			callback()
		}
		
	})
}
function remove_funder(data,callback) {
	var res=data.res;
	var req=data.req;
	var id=req.query.id;
	var q="DELETE FROM funders WHERE id=?"
	connection.query(q,[id],function (err,rst) {
		if(err){

			if(err.errno==1451){
				data.errmsg="Unable to remove item; it's interlinked with other entities. Please contact support"
			}
		}
		callback()
	})
}
function change_order_status(i,data,callback) {
	var req=data.req;
	var oid=req.query.oid

	if(i==oid.length)
		return callback()
	var req=data.req;
	var status=req.query.status;
	var id=oid[i]

	var q="UPDATE egg_orders SET status=? WHERE id=?"
	connection.query(q,[status,id],function (err,rst) {
		if(err)
			console.log(err)
		var q="INSERT INTO egg_orders_status (order_id,status) VALUES (?,?)"
		connection.query(q,[id,status])
		change_order_status(++i,data,callback)
	})
}
function get_dashboard_data(data,callback) {
	get_stock_summary(data,function (argument) {
		get_group_count(data,function (argument) {
			get_orders_summary(data,function (argument) {
				get_chicken_orders_summary(data,function (argument) {
					data.latest=1
					get_cs_sum(data,function () {
						get_chicken_stock_sum(data,function () {
							callback()
						})
						
					})
				})
			})
		})
	})
}

function get_cs(data,callback) {
	var req=data.req;
	var q="SELECT SUM(healthy) AS healthy,sum(sick) AS sick, SUM(dead) AS dead,SUM(sold) AS sold,SUM(healthy_nl) AS healthy_nl,sum(sick_nl) AS sick_nl, SUM(dead_nl) AS dead_nl,SUM(sold_nl) AS sold_nl,groups.group_name AS group_name,groups.group_no FROM chicken_status,groups WHERE chicken_status.group_id=groups.id AND latest=1 GROUP BY chicken_status.group_id"
	var arr=[]
	if(req.user.priv=="funder"){
		q="SELECT SUM(healthy) AS healthy,sum(sick) AS sick, SUM(dead) AS dead,SUM(sold) AS sold,SUM(healthy_nl) AS healthy_nl,sum(sick_nl) AS sick_nl, SUM(dead_nl) AS dead_nl,SUM(sold_nl) AS sold_nl,groups.group_name AS group_name,groups.group_no FROM chicken_status,groups WHERE chicken_status.group_id=groups.id AND funder_id=? AND latest=1 GROUP BY chicken_status.group_id"
		arr=[req.user.id]
	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.chicken_status=rst;
		callback()
	})
}
function get_cs_sum(data,callback) {
	var req=data.req;
	
	var q="SELECT SUM(healthy) AS healthy,sum(sick) AS sick, SUM(dead) AS dead,SUM(sold) AS sold,SUM(healthy_nl) AS healthy_nl,sum(sick_nl) AS sick_nl, SUM(dead_nl) AS dead_nl,SUM(sold_nl) AS sold_nl FROM chicken_status WHERE latest=1"
	var arr=[]
	if(req.user.priv=="funder"){
		var q="SELECT SUM(healthy) AS healthy,sum(sick) AS sick, SUM(dead) AS dead,SUM(sold) AS sold,SUM(healthy_nl) AS healthy_nl,sum(sick_nl) AS sick_nl, SUM(dead_nl) AS dead_nl,SUM(sold_nl) AS sold_nl FROM chicken_status,group_members,groups WHERE chicken_status.member_id=group_members.id AND group_members.group_id=groups.id AND groups.funder_id=? AND latest=1"
		arr=[req.user.id]
	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.cs_sum=rst;
		callback()
	})
}
function get_chicken_stock(data,callback) {
	var req=data.req;
	var status=req.query.status
	var q="SELECT stock_no,qty,suppliers.business_name,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS tr,DATEDIFF(now(),time_recorded) AS age,chicken_stock.status FROM chicken_stock,suppliers WHERE chicken_stock.status=? AND suppliers.id=chicken_stock.supplier_id ORDER BY time_recorded DESC"
	connection.query(q,[status],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.chicken_stock=rst;
		callback()
	})
}
function get_chicken_stock_sum(data,callback) {
	var req=data.req;
	var status="Ready for Sale"
	var ostatus="Under Brooding"
	var q="UPDATE chicken_stock SET status=? WHERE DATEDIFF(DATE_ADD(now(),INTERVAL 8 HOUR),time_recorded)>=60 AND status=?"
	connection.query(q,[status,ostatus],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		var q="SELECT SUM(qty) AS qty,status FROM chicken_stock GROUP BY status"
		connection.query(q,function (err,rst) {
			if(err)
				return console.log(err.sqlMessage)

			data.chicken_stock_sum=rst;
			
			callback()
		})
	})
}
function get_chicken_orders_summary(data,callback) {
	var req=data.req;
	var group_id=data.group_id
	var q="SELECT SUM(amount) AS amount,SUM(qty) AS qty,COUNT(*) AS no,status FROM chicken_orders GROUP BY status"
	var arr=[]
	if(req.user.priv=="funder")
	{
		var q="SELECT SUM(amount) AS amount,SUM(qty) AS qty,COUNT(*) AS no,status FROM chicken_orders,groups WHERE chicken_orders.group_id=groups.id AND funder_id=? GROUP BY status"
		arr=[req.user.id]
	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			console.log(err)
		data.chicken_orders_sum=rst;
		callback()
	})
}
function get_group_count(data,callback){
	var req=data.req;
	var q="SELECT COUNT(*) AS no FROM groups"
	var arr=[]
	if(req.user.priv=="funder")
	{
		var q="SELECT COUNT(*) AS no FROM groups WHERE funder_id=?"
		arr=[req.user.id]
	}

	connection.query(q,arr,function (err,rst) {

		if(err)
			return console.log(err.sqlMessage)
		data.group_count=rst[0].no
		arr=[]
		q="SELECT COUNT(*) AS no FROM group_members"
		if(req.user.priv=="funder")
		{
			q="SELECT COUNT(*) AS no FROM group_members,groups WHERE group_members.group_id=groups.id AND groups.funder_id=?"
			arr=[req.user.id]


		}
		connection.query(q,arr,function (err,rst) {
			data.members_count=rst[0].no
			q="SELECT COUNT(*) AS no FROM suppliers"
			connection.query(q,function(err,rst){
				data.suppliers_count=rst[0].no
				callback()
			})
			
		})
	})	
}
function get_stock_summary(data,callback) {
	var req=data.req;

	var q="SELECT SUM(price*trays) AS amount,SUM(trays) AS trays, status FROM egg_stock GROUP BY status"
	var arr=[]
	if(req.user.priv=="funder"){
		var q="SELECT SUM(price*trays) AS amount,SUM(trays) AS trays, status FROM egg_stock,groups WHERE egg_stock.group_id=groups.id AND groups.funder_id=? GROUP BY status"
		arr=[req.user.id]
	}
	connection.query(q,arr,function (err,rst) {

		data.stock_sum=rst;
		db.get_instock(data,function () {
			callback()
		})
	})
}
function get_orders_summary(data,callback) {
	var req=data.req;
	var q="SELECT SUM(amount) AS amount,sum(trays) AS trays, SUM(trays) AS trays,status FROM egg_orders GROUP BY status"
	connection.query(q,function (err,rst) {
		data.orders_sum=rst;
		callback()
	})
}

function change_stock_status(i,data,callback) {
	var req=data.req;
	var oid=req.query.oid
	if(i==oid.length)
		return callback()
	var req=data.req;
	var status=req.query.status;
	var id=oid[i].id;
	var q="UPDATE egg_stock SET status=? WHERE id=?"

	connection.query(q,[status,id],function (err,rst) {
		
		if(err)
			console.log(err)
		
		var status=req.query.status
	
		q="INSERT INTO egg_stock_status(stock_id,status) VALUES(?,?)"
		var ostatus=req.query.ostatus
		connection.query(q,[id,status])
		if(status=="Paid"||ostatus=="Paid")
		{
			var account_no=oid[i].acc;
			var amount=oid[i].amount
			var stock_no=oid[i].stock_no	
			var type="Credit"
			var description="Credit for Eggs Stock, Stock No: "+stock_no
			if(ostatus){
				type="Debit"
				description="Reversal of payment for Eggs Stock, Stock No: "+stock_no
			}
			var status="Completed"
			var trans_id=db.gen_random(15)
			var wd=[account_no,amount,type,description,status,trans_id]
			db.update_wallet(wd)
		}
		change_stock_status(++i,data,callback)
		
	})
}

function get_orders(data,callback) {
	var req=data.req;
	var status=req.query.status
	var q="SELECT egg_orders.id,order_no,name AS customer,trays/30 AS trays, amount, method,DATE_FORMAT(DATE_ADD(order_time,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time FROM egg_orders,customers WHERE egg_orders.customer_id=customers.id AND egg_orders.status=? ORDER BY order_time DESC"
	connection.query(q,[status],function (err,rst) {
		data.orders=rst;
		callback()
	})
}
function get_chicken_orders(data,callback) {
	var req=data.req;
	var status=req.query.status
	if(status=="Out for Delivery"||status=="Delivered"){
		//to avoid skipping out items due to null suppliers
		var q="SELECT chicken_orders.id,order_no,no,message,group_name,groups.id AS group_id,group_no,qty,amount,chicken_orders.phone,method,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time,time_recorded,suppliers.business_name AS supplier,chicken_orders.status,age,DATEDIFF(now(),time_received) AS age2 FROM chicken_orders,groups,suppliers WHERE chicken_orders.group_id=groups.id AND chicken_orders.status=? AND chicken_orders.supplier_id=suppliers.id ORDER BY time_recorded DESC"
			var arr=[status]
			if(req.user.priv=="funder"){
				q="SELECT chicken_orders.id,order_no,no,chicken_orders.phone,message,group_name,group_no,groups.id AS group_id,qty,amount,chicken_orders.phone,method,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time,time_recorded,suppliers.business_name AS supplier,chicken_orders.status,age,DATEDIFF(now(),time_received) AS age2 FROM chicken_orders,groups,suppliers WHERE  chicken_orders.group_id=groups.id AND chicken_orders.status=? AND chicken_orders.supplier_id=suppliers.id AND groups.funder_id=? ORDER BY time_recorded DESC"
				arr=[status,req.user.id]
			}
	}
	else
	{

		var q="SELECT chicken_orders.id,order_no,no,message,group_name,group_no,groups.id AS group_id,qty,amount,chicken_orders.phone,method,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time,time_recorded,status,age,DATEDIFF(now(),time_received) AS age2 FROM chicken_orders,groups WHERE chicken_orders.group_id=groups.id AND chicken_orders.status=? ORDER BY time_recorded DESC"
		var arr=[status]
		if(req.user.priv=="funder"){
			q="SELECT chicken_orders.id,order_no,no,chicken_orders.phone,message,group_name,group_no,groups.id AS group_id,amount,chicken_orders.phone,method,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS order_time,time_recorded,status,age,DATEDIFF(now(),time_received) AS age2 FROM chicken_orders,groups WHERE chicken_orders.group_id=groups.id AND chicken_orders.status=? AND funder_id=? ORDER BY time_recorded DESC"
			arr=[status,req.user.id]
		}
	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		data.orders=rst;


		callback()
	})
}
function get_chicken_orders_breakdown(data,callback) {
	var req=data.req;
	var group_id=req.query.group_id
	var group_order_no=req.query.group_order_no
	var q="SELECT chicken_orders_bd.id,chicken_orders_bd.order_no,chicken_orders.status,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS time_recorded,time_recorded AS ordered_on,chicken_orders_bd.qty,(price*chicken_orders_bd.qty) AS amount,name AS member_name,DATE_FORMAT(time_received,'%e %b %Y %l:%i %p') AS tr,age,DATEDIFF(DATE_ADD(now(),INTERVAL 8 HOUR),time_received) AS age2  FROM chicken_orders_bd,group_members,chicken_orders WHERE group_members.group_id=? AND group_members.id=chicken_orders_bd.member_id AND chicken_orders_bd.group_order_no=chicken_orders.order_no AND group_order_no=? ORDER BY ordered_on DESC"
		var arr=[group_id,group_order_no]
	connection.query(q,arr,function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.orders_bd=rst;
		callback()
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
	var supplier_id=req.query.supplier_id;
	var order_no=id;
	var phone=""
	var message=status
	var method=""
	db.update_chicken_order_status(order_no,status,phone,message,method,supplier_id,function(){
		change_chicken_order_status(++i,data,callback)
	})

}
function get_stock(data,callback) {
	var req=data.req;
	var status=req.query.status
	var q="SELECT egg_stock.id,stock_no,group_name,trays,egg_stock.price *trays AS amount,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS posted_on,group_members.name AS member_name,member_no FROM egg_stock,groups,group_members WHERE egg_stock.group_id=groups.id AND group_members.id=egg_stock.member_id AND egg_stock.status=? ORDER BY time_recorded DESC"
	var arr=[status]
	if(req.user.priv=="funder")
	{
		q="SELECT egg_stock.id,stock_no,group_name,trays,egg_stock.price *trays AS amount,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS posted_on,group_members.name AS member_name,member_no FROM egg_stock,groups,group_members WHERE egg_stock.group_id=groups.id AND group_members.id=egg_stock.member_id AND egg_stock.status=? AND funder_id=? ORDER BY time_recorded DESC"
		arr=[status,req.user.id]

	}
	connection.query(q,arr,function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		data.stock=rst;
		
		callback()
	})
}
function set_egg_price(data,callback) {
	var req=data.req;
	var price=req.query.price;
	var field=req.query.field
	
	var q="UPDATE settings SET ??=?"
	connection.query(q,[field,price],function (err) {
		if(err)
			console.log(err.sqlMessage)
		callback()
	})

}


function gen_group_no(){
	var data={}
	get_groups(data,function (argument) {
		for(var i=0;i<data.groups.length;i++){
			var id=data.groups[i].id;
			var group_no=db.gen_random(6)
			var q="UPDATE groups SET group_no=? WHERE id=?"
			connection.query(q,[group_no,id],function () {
			})
		}
	})
}
//groups
function create_group(data,callback) {
	var res=data.res;
	var req=data.req;
	var group_name=req.body.group_name;
	var district=req.body.district;
	var county=req.body.county
	var subcounty=req.body.subcounty
	var parish=req.body.parish;
	var created_by=req.user.id;
	var luserid=req.body.luserid;//group leader user id
	var meeting_place=req.body.meeting_place
	var village=req.body.village
	var group_no=db.gen_random(6)
	var meeting_day=req.body.meeting_day
	var funder_id=req.body.funder_id
	var q="INSERT INTO groups (funder_id,group_no,group_name,district,county,subcounty,parish,village,meeting_place,meeting_day,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
	connection.query(q,[funder_id,group_no,group_name,district,county,subcounty,parish,village,meeting_place,meeting_day,created_by],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)

		var group_id=rst.insertId;
		var cert_photo=0;
		if(req.files){
			var cert_photo= req.files.cert_photo
		}
		if(cert_photo)
			db.upload_photo(cert_photo,"certs","grc-"+rst.insertId)
		callback()
	})
}
function edit_group(data,callback) {

	var res=data.res;
	var req=data.req;
	var group_name=req.body.group_name;
	var district=req.body.district;
	var county=req.body.county
	var subcounty=req.body.subcounty
	var parish=req.body.parish;
	var created_by=req.user.id;
	var luserid=req.body.luserid;//group leader user id
	var meeting_place=req.body.meeting_place
	var village=req.body.village
	var group_no=db.gen_random(6)
	var meeting_day=req.body.meeting_day
	var group_id=req.body.group_id
	var funder_id=req.body.funder_id
	var q="UPDATE groups SET funder_id=?,group_name=?,district=?,county=?,subcounty=?,parish=?,village=?,meeting_place=?,meeting_day=? WHERE id=?"
	connection.query(q,[funder_id,group_name,district,county,subcounty,parish,village,meeting_place,meeting_day,group_id],function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		var cert_photo=0;

		if(req.files){
			var cert_photo= req.files.cert_photo
		}
		if(cert_photo)
			db.upload_photo(cert_photo,"certs","grc-"+group_id)
		callback()
		
	})
}
function remove_group(data,callback) {
	var res=data.res;
	var req=data.req;
	var group_id=req.query.group_id

	var q="DELETE FROM groups WHERE id=?"
	connection.query(q,[group_id],function (err,rst) {
		if(err){

			if(err.errno==1451){
				data.errmsg="Unable to remove group; it's interlinked with other entities. Please contact support"
			}
		}
		callback()
	})
}
function get_groups(data,callback) {

	var req=data.req;
	var q="SELECT groups.*,business_name FROM groups LEFT JOIN funders ON groups.funder_id=funders.id  ORDER BY time_created DESC"
	var arr=[]
	if(req.user.priv=="funder"){
		var q="SELECT groups.*,business_name FROM groups,funders WHERE groups.funder_id=funders.id AND funder_id=? ORDER BY time_created DESC"
		var arr=[req.user.id]
	}
	var filter=req.query.filter;
	if(filter){
		if(filter=="district"){
			q="SELECT groups.*,business_name FROM groups LEFT JOIN funders ON groups.funder_id=funders.id AND groups.district=? ORDER BY time_created DESC"
			arr=[req.query.district]
			if(req.user.priv=="funder"){
				q="SELECT  groups.*,business_name FROM groups,funders  WHERE groups.funder_id=funders.id AND groups.district=? AND funder_id=? ORDER BY time_created DESC"
				arr=[req.query.district,req.user.id]
			}


		}
		if(filter=="no"){
			q="SELECT groups.*,business_name FROM groups LEFT JOIN funders  ON groups.funder_id=funders.id AND group_no=? ORDER BY time_created DESC"
			arr=[req.query.group_no]
			if(req.user.priv=="funder"){
				q="SELECT  groups.*,business_name FROM groups,funders  WHERE groups.funder_id=funders.id AND group_no=? AND funder_id=? ORDER BY time_created DESC"
				arr=[req.query.group_no,req.user.id]
			}
		}
		if(filter=="name")
		{
			q="SELECT groups.*,business_name FROM groups LEFT JOIN funders ON groups.funder_id=funders.id AND group_name LIKE '%"+req.query.group_name+"%' ORDER BY time_created DESC"

			if(req.user.priv=="funder"){
				q="SELECT groups.*,business_name FROM groups,funders  WHERE groups.funder_id=funders.id AND group_name LIKE '%"+req.query.group_name+"%' AND funder_id=? ORDER BY time_created DESC"
				arr=[req.user.id]
			}
			
		}
		
	}
	connection.query(q,arr,function (err,rst) {
		data.groups=rst;

		if(err)
			console.log(err.sqlMessage)
		callback()
	})
}

function create_supplier(data,callback) {
	var res=data.res;
	var req=data.req;
	var phone=req.body.phone;
	var business_name=req.body.business_name;
	var district=req.body.district;
	var county=req.body.county
	var subcounty=req.body.subcounty
	var parish=req.body.parish;
	var village=req.body.village;
	var created_by=req.user.id;
	var address=req.body.address
	var supplier_no=db.gen_random(6)
	var name=req.body.name;
	var email=req.body.email
	var gender=req.body.gender;
	var password=db.gen_random(6)
		var table="suppliers"
	var phoneb=req.body.phoneb;
	db.check_exists(data,phone,email,table,function(){
		var q="INSERT INTO suppliers (name,email,phone,phoneb,password,reset_code,gender,username,supplier_no,business_name,district,county,subcounty,parish,village,address,created_by) VALUES (?,?,?,?,SHA1(?),?,?,?,?,?,?,?,?,?,?,?,?)"
		connection.query(q,[name,email,phone,phoneb,password,password,gender,supplier_no,supplier_no,business_name,district,county,subcounty,parish,village,address,created_by],function (err,rst) {
			if(err){
				console.log(err.sqlMessage)
				if(err.errno==1062){
					data.errmsg="The user already exists as a Supplier"
					return callback()
				}
				return 0;
			}
			else
				var supplier_id=rst.insertId;
			var profile_photo=0;var id_photo=0;
			if(req.files){
				var profile_photo= req.files.profile_photo
				var id_photo= req.files.id_photo
			}
			if(profile_photo&&id_photo){
				db.upload_photo(profile_photo,"profiles","supp-"+supplier_id)
				db.upload_photo(id_photo,"ids","supp-"+supplier_id,callback)
			}
		})
	})
}
function edit_supplier(data,callback) {

	var req=data.req;
	var phone=req.body.phone;
	var phoneb=req.body.phoneb
	var business_name=req.body.business_name;
	var district=req.body.district;
	var county=req.body.county
	var subcounty=req.body.subcounty
	var parish=req.body.parish;
	var village=req.body.village;
	var created_by=req.user.id;
	var address=req.body.address
	var name=req.body.name;
	var email=req.body.email
	var gender=req.body.gender;
	var supplier_id=req.body.supplier_id

	var q="UPDATE suppliers SET name=?,email=?,phone=?,phoneb=?,gender=?,business_name=?,district=?,county=?,subcounty=?,parish=?,village=?,address=? WHERE id=?"
	connection.query(q,[name,email,phone,phoneb,gender,business_name,district,county,subcounty,parish,village,address,supplier_id],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		var profile_photo=0;var id_photo=0;
		if(req.files){
			var profile_photo= req.files.profile_photo
			var id_photo= req.files.id_photo
		}
		if(profile_photo&&id_photo){
			db.upload_photo(profile_photo,"profiles","supp-"+supplier_id)
			db.upload_photo(id_photo,"ids","supp-"+supplier_id,callback)
		}
		else if(id_photo){
			db.upload_photo(id_photo,"ids","supp-"+supplier_id)
			db.upload_photo(profile_photo,"profiles","supp-"+supplier_id,callback)
		}
		else if(profile_photo){
			
			db.upload_photo(profile_photo,"profiles","supp-"+supplier_id,callback)
		}
		else{
			callback()
		}
		
	})
}
function get_suppliers(data,callback) {
	var q="SELECT suppliers.id,supplier_no,reset_code,business_name,suppliers.district,county,suppliers.subcounty,suppliers.parish,village,address,created_by,name AS supplier_name,phone,phoneb,gender,email,status FROM suppliers ORDER BY time_created DESC"
	connection.query(q,function (err,rst) {
		if(err)
			console.log(err)
		data.suppliers=rst;
		
		callback()
	})
}
function get_orgs(data,callback) {
	var q="SELECT funders.id,funder_no,reset_code,created_by,name AS org_name,phone,phoneb,email,status FROM funders ORDER BY time_created DESC"
	connection.query(q,function (err,rst) {
		if(err)
			console.log(err)
		data.funders=rst;
		
		callback()
	})
}
function remove_supplier(data,callback) {
	var res=data.res;
	var req=data.req;
	var group_id=req.query.group_id

	var q="DELETE FROM suppliers WHERE id=?"
	connection.query(q,[group_id],function (err,rst) {
		if(err){

			if(err.errno==1451){
				data.errmsg="Unable to remove supplier; it's interlinked with other entities. Please contact support"
			}
		}
		callback()
	})
}

