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
			return res.send({errmsg:"Please login to access this portal"})
		}
		else
			return res.redirect("/")
	}
	else if(req.user.priv!="admin"){
		if(ajax){
			return res.send({errmsg:"Account does not have priviledge to access this portal"})
		}
		else
			return res.redirect("/market")
	}
	data.user=req.user;
	data.me=req.user
	
	if(rq=="get-defaults"){

		db.get_districts(data,function () {
			db.get_mygroups(data,function () {
				get_dashboard_data(data,function () {
					db.get_settings(data,function () {
						get_suppliers(data,function () {
							data.res=0;data.req=0;
							res.send(data)
						})
					})
				})
			})
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
	else if(rq=="get-orders"){
		get_orders(data,function () {
			data.res=0;data.req=0;
			res.send(data)
		})
	}
	else if(rq=="get-supply-orders"){
		get_supply_orders(data,function () {
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
	else if(rq=="change-supply-order-status"){
		change_supply_orders_status(0,data,function () {
			get_supply_orders(data,function () {
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
		change_order_status(++i,data,callback)
	})
}
function get_dashboard_data(data,callback) {
	get_stock_summary(data,function (argument) {
		get_group_count(data,function (argument) {
			get_orders_summary(data,function (argument) {
				get_supply_orders_summary(data,function (argument) {
					data.latest=1
					get_cs_sum(data,function () {
						callback()
					})
				})
			})
		})
	})
}
function get_cs(data,callback) {

	var req=data.req;
	var year=req.query.year;
	var month=req.query.month;
	var week=req.query.week;
	if(req.query.latest==1){
		//dashbaord item click and retrieving for current week, year, and month
		var dt=new Date()
		var year=dt.getFullYear()
		var month=dt.getMonth()+1;
		var day=dt.getDate()
		if(day<=7)
			week=1
		else if(day<=14)
			week=2
		else if(day<=21)
			week=3
		else
			week=4
	}
	 var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]

	data.cshdr="Week "+week+", "+months[month-1]+", "+year
	var q="SELECT SUM(healthy) AS healthy,sum(sick) AS sick, SUM(dead) AS dead,groups.group_name AS group_name,groups.group_no FROM chicken_status,groups WHERE chicken_status.group_id=groups.id AND year=? AND month=? AND week=? GROUP BY chicken_status.group_id"
	connection.query(q,[year,month,week],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.chicken_status=rst;
		
		callback()
	})
}
function get_cs_sum(data,callback) {
	var req=data.req;
	var year=req.query.year;
	var month=req.query.month;
	var week=req.query.week;
	if(req.query.latest==1||data.latest==1){
		//dashbaord item click and retrieving for current week, year, and month
		var dt=new Date()
		var year=dt.getFullYear()
		var month=dt.getMonth()+1;
		var day=dt.getDate()
		if(day<=7)
			week=1
		else if(day<=14)
			week=2
		else if(day<=21)
			week=3
		else
			week=4
	}
	var q="SELECT SUM(healthy) AS healthy,sum(sick) AS sick, SUM(dead) AS dead FROM chicken_status,groups WHERE chicken_status.group_id=groups.id AND year=? AND month=? AND week=?"
	connection.query(q,[year,month,week],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.cs_sum=rst;
		callback()
	})
}
function get_supply_orders_summary(data,callback) {
	var req=data.req;
	var group_id=data.group_id
	var q="SELECT SUM(price*qty) AS amount,SUM(qty) AS qty,count(*) AS no,status FROM supply_orders GROUP BY status"
	connection.query(q,[group_id],function (err,rst) {
		if(err)
			console.log(err)
		data.supply_orders_sum=rst;

		callback()
	})
}
function get_group_count(data,callback){
	var q="SELECT COUNT(*) AS no FROM groups"
	connection.query(q,function (err,rst) {
		data.group_count=rst[0].no
		q="SELECT COUNT(*) AS no FROM group_members"
		connection.query(q,function (err,rst) {
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
	connection.query(q,function (err,rst) {
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
	var id=oid[i]
	var q="UPDATE egg_stock SET status=? WHERE id=?"
	connection.query(q,[status,id],function (err,rst) {
		if(err)
			console.log(err)
		change_stock_status(++i,data,callback)
	})
}
function get_orders(data,callback) {
	var req=data.req;
	var status=req.query.status
	var q="SELECT egg_orders.id,order_no,name AS customer,trays/30 AS trays, amount, method,DATE_FORMAT(order_time,'%c %b %Y %l:%i %p') AS order_time FROM egg_orders,customers WHERE egg_orders.customer_id=customers.id AND egg_orders.status=? ORDER BY order_time DESC"
	connection.query(q,[status],function (err,rst) {
		data.orders=rst;
		callback()
	})
}
function get_supply_orders(data,callback) {
	var req=data.req;
	var status=req.query.status
	
	//var q="SELECT supply_orders.id,order_no,group_name,group_no,group_members.name AS member_name,qty,(qty*price) AS amount,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS order_time,time_recorded,suppliers.name FROM supply_orders INNER JOIN group_members  ON supply_orders.member_id=group_members.id INNER JOIN groups ON supply_orders.group_id=groups.id AND supply_orders.status='Out for Delivery' LEFT JOIN suppliers ON suppliers.id=supply_orders.supplier_id ORDER BY time_recorded DESC"
	if(status=="Out for Delivery"||status=="Delivered")
		var q="SELECT supply_orders.id,order_no,group_name,group_no,group_members.name AS member_name,qty,(qty*price) AS amount,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS order_time,time_recorded,suppliers.business_name AS supplier FROM supply_orders,group_members,groups,suppliers WHERE supply_orders.member_id=group_members.id AND supply_orders.group_id=groups.id AND supply_orders.status=? AND supply_orders.supplier_id=suppliers.id ORDER BY time_recorded DESC"
	else
	{
		var q="SELECT supply_orders.id,order_no,group_name,group_no,name AS member_name,qty,(qty*price) AS amount,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS order_time,time_recorded FROM supply_orders,group_members,groups WHERE supply_orders.member_id=group_members.id AND supply_orders.group_id=groups.id AND supply_orders.status=? ORDER BY time_recorded DESC"
	}
	connection.query(q,[status],function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		
		data.orders=rst;
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
	var supplier_id=req.query.supplier_id;
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
function get_stock(data,callback) {
	var req=data.req;
	var status=req.query.status
	var q="SELECT egg_stock.id,stock_no,group_name,trays,egg_stock.price *trays AS amount,DATE_FORMAT(time_recorded,'%c %b %Y %l:%i %p') AS posted_on,CONCAT(district,', ',subcounty) AS location FROM egg_stock,groups WHERE egg_stock.group_id=groups.id AND egg_stock.status=? ORDER BY time_recorded DESC"
	connection.query(q,[status],function (err,rst) {
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

	var q="INSERT INTO groups (group_no,group_name,district,county,subcounty,parish,village,meeting_place,meeting_day,created_by) VALUES (?,?,?,?,?,?,?,?,?,?)"
	connection.query(q,[group_no,group_name,district,county,subcounty,parish,village,meeting_place,meeting_day,created_by],function (err,rst) {
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

	var q="UPDATE groups SET group_name=?,district=?,county=?,subcounty=?,parish=?,village=?,meeting_place=?,meeting_day=? WHERE id=?"
	connection.query(q,[group_name,district,county,subcounty,parish,village,meeting_place,meeting_day,group_id],function (err,rst) {
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
	var q="SELECT *FROM groups ORDER BY time_created DESC"
	var arr=[]
	var filter=req.query.filter;
	if(filter){
		if(filter=="district"){
			q="SELECT *FROM groups  WHERE district=? ORDER BY time_created DESC"
			arr=[req.query.district]

		}
		if(filter=="no"){
			q="SELECT *FROM groups  WHERE group_no=? ORDER BY time_created DESC"
			arr=[req.query.group_no]
		}
		if(filter=="name")
		{
			q="SELECT *FROM groups  WHERE group_name LIKE '%"+req.query.group_name+"%' ORDER BY time_created DESC"
			
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

