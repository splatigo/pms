'use strict'
var mysql=require("mysql");
if(process.env.server){
	var db_url="uipevote_pms"
	var db_user="uipevote_pms"
	var db_host="localhost"
	var db_pass="trans1423"

}
else{
	var db_url="poultrydb"
	var db_user="root"
	var db_host="127.0.0.1"
	var db_pass=""
}
exports.db_url=db_url;
exports.db_user=db_user;
exports.db_host=db_host
exports.db_pass=db_pass
//=process.env.database_url
var multer  = require('multer')
var fileUpload = require('express-fileupload');
var connection=mysql.createConnection(
{
   host: db_host,
   user :db_user,
   password: db_pass,
   database:db_url,
   waitForConnections: true,
   connectionLimit:1000
})

exports.index=function(req,res){
	var data={req,res}
	var rq=req.query.rq;
	if(rq=="get-counties"){
		exports.get_counties(data)
	}
	else if(rq=="get-subcounties"){

		exports.get_subcounties(data)
	}
	else if(rq=="get-parishes"){
		exports.get_parishes(data)
	}
}

var query=function (q,arr,callback) {
	connection.query(q,arr,function (err,rst) {
		if(err){
			if(err.code="ER_BAD_DB_ERROR"){
				callback("error")
			}
		}
		else
		{
			
			callback(rst)

		}
		
	})
	
}
var nquery =function(q,arr,callback) {
	
	connection.query(q,arr,function (err,rst) {
		
		callback(err,rst)
		
	})
	
}
exports.query=query;
exports.nquery=nquery;
function log_data(userid,table,tableid,arr,message) {
	var arr=JSON.stringify(arr);
	var q="INSERT INTO logs(userid,table_affected,table_id,arr,message) VALUES (?,?,?,?,?)";
	connection.query(q,[userid,table,tableid,arr,message],function (err) {
		if(err)		
			console.log(err.sqlMessage)
	})
}
exports.log_data=log_data;
function get_mygroups(data,callback) {
	var res=data.res;
	var req=data.req;
	var userid=req.user.id;
	var q="SELECT group_name,group_id FROM group_members,groups WHERE group_members.group_id=groups.id AND userid=?"
	connection.query(q,[userid],function (err,rst) {
		data.mygroups=rst;
		callback()
	})
}
exports.get_mygroups=get_mygroups

function get_group_details(data,callback) {
	var req=data.req;
	var group_id=req.user.group_id
	var q="SELECT *FROM groups WHERE id=?"
	connection.query(q,[group_id],function (err,rst) {
		data.group_details=rst;
		callback()
	})
}
exports.get_group_details=get_group_details
function get_group_members(group_id,callback) {
	var clms="id,reset_code,member_no,name,phone,gender,email,phoneb,dob,DATE_FORMAT(dob,'%Y-%c-%e') AS dob2,marital_status,no_of_dependants,name_of_spouse,disability_status,disability_type,district,county,subcounty,parish,village,education_level,souce_of_income,place_of_operation,id_no,nok_name,nok_primary_phone,nok_other_phone,group_id,role"
	var q="SELECT "+clms+" FROM group_members WHERE group_id=? ORDER BY reg_date DESC"
	connection.query(q,[group_id],function (err,rst) {
		
		callback(rst)
	})
}
exports.get_group_members=get_group_members;

function add_group_member(data,callback) {
	var req=data.req;
	var district=req.body.district
	var county=req.body.county
	var dependants= req.body.dependants
	if(dependants=="")
		dependants=0
	var disability_status=req.body.disability_status
	var disability_type=req.body.disability_type
	var dob=req.body.dob;
	if(dob=="-")
		dob=null
	var edu_level= req.body.edu_level
	var gender= req.body.gender
	var group_id= req.body.group_id
	var id_no= req.body.id_no
	var income_source= req.body.income_source
	var marital_status= req.body.marital_status
	var nok=req.body.nok;
	var nok_phone=req.body.nok_phone
	var nok_phoneb= req.body.nok_phoneb
	var parish= req.body.parish
	var phoneb= req.body.phoneb
	var place_of_operation= req.body.place_of_operation
	var position= req.body.position
	var role= req.body.role;
	if(role=="0")
		role="Member"
	var spouse= req.body.spouse
	var subcounty= req.body.subcounty
	var village= req.body.village
	var name=req.body.name;
	var email=req.body.email;
	if(email=="")
		email=null
	var phone=req.body.phone;
	if(phone=="")
		phone=null
	var password=gen_random(6)
	var member_no=gen_random(6)
	var reset_code=password
	var clms="username,member_no,name,password,reset_code,phone,gender,phoneb,email,dob,marital_status,no_of_dependants,name_of_spouse,disability_status,disability_type,district,county,subcounty,parish,village,education_level,souce_of_income,place_of_operation,id_no,nok_name,nok_primary_phone,nok_other_phone,group_id,role"
	var arr=[member_no,member_no,name,password,reset_code,phone,gender,phoneb,email,dob,marital_status,dependants,spouse,disability_status,disability_type,district,county,subcounty,parish,village,edu_level,income_source,place_of_operation,id_no,nok,nok_phone,nok_phoneb,group_id,role]
	var qr=""
	for(var i=0;i<arr.length;i++){
		if(i==3)
			qr+="SHA1(?),"
		else
			qr+="?,"
	}
	qr=qr.substring(0,qr.length-1)

	
	var q="INSERT INTO group_members ("+clms+") VALUES ("+qr+")";

		connection.query(q,arr,function (err,rst) {
			if(err){
				console.log(err.sqlMessage)
				data.errmsg="An error occurred, please try again"
				if(err.errno==1062){
					data.errmsg="Unable to add user, phone or email already in use"
					return callback()
				}
			}
			var insertId=rst.insertId
			var profile_photo=0;var id_photo=0;
			if(req.files){
					var profile_photo=req.files.profile_photo;var id_photo=req.files.id_photo;
			}
			if(profile_photo&&id_photo){
				upload_photo(profile_photo,"profiles","gm-"+insertId)
				upload_photo(id_photo,"ids","gm-"+insertId,callback)
			}
			else
				callback()
			
		})	
}
function edit_group_member(data,callback) {
	var req=data.req;
	var district=req.body.district
	var county=req.body.county
	var dependants= req.body.dependants
	if(dependants=="")
		dependants=0
	var disability_status=req.body.disability_status
	var disability_type=req.body.disability_type
	var dob=req.body.dob;
	if(dob=="-")
		dob=null
	var edu_level= req.body.edu_level
	var gender= req.body.gender
	var group_id= req.body.group_id
	var id_no= req.body.id_no
	var income_source= req.body.income_source
	var marital_status= req.body.marital_status
	var nok=req.body.nok;
	var nok_phone=req.body.nok_phone
	var nok_phoneb= req.body.nok_phoneb
	var parish= req.body.parish
	var phoneb= req.body.phoneb
	var place_of_operation= req.body.place_of_operation
	var position= req.body.position
	var role= req.body.role;
	if(role=="0")
		role="Member"

	var spouse= req.body.spouse
	var subcounty= req.body.subcounty
	var village= req.body.village
	var name=req.body.name;
	var email=req.body.email;
	if(email=="")
		email=null
	var phone=req.body.phone;
	if(phone=="")
		phone=null
	var member_id=req.body.member_id;
	var clms="name=?,phone=?,gender=?,email=?,phoneb=?,dob=?,marital_status=?,no_of_dependants=?,name_of_spouse=?,disability_status=?,disability_type=?,district=?,county=?,subcounty=?,parish=?,village=?,education_level=?,souce_of_income=?,place_of_operation=?,id_no=?,nok_name=?,nok_primary_phone=?,nok_other_phone=?,role=?"
	var arr=[name,phone,gender,email,phoneb,dob,marital_status,dependants,spouse,disability_status,disability_type,district,county,subcounty,parish,village,edu_level,income_source,place_of_operation,id_no,nok,nok_phone,nok_phoneb,role,member_id]
	
	var q="UPDATE group_members SET "+clms+" WHERE id=?";
	connection.query(q,arr,function (err,rst) {
		if(err){
			console.log(err.sqlMessage)
			data.errmsg="An error occurred, please try again"
			if(err.errno==1062){
				data.errmsg="Unable to update, phone or email already in use"
				return callback()
			}
		}
		
		
		var profile_photo=0;var id_photo=0;
		if(req.files){
			var profile_photo=req.files.profile_photo;var id_photo=req.files.id_photo;
		}
		
		if(profile_photo&&id_photo){
				upload_photo(profile_photo,"profiles","gm-"+member_id)
				upload_photo(id_photo,"ids","gm-"+member_id,callback)
			}
		else if(id_photo){
				upload_photo(id_photo,"ids","gm-"+member_id)
				upload_photo(profile_photo,"profiles","gm-"+member_id,callback)
		}
		else if(profile_photo){

			upload_photo(profile_photo,"profiles","gm-"+member_id,callback)
		}
		else{
			callback()
		}
		
	})
	
}
exports.edit_group_member=edit_group_member
function upload_photo(file,type,fn,callback) {
	var pn=file;
	var path="/public/uploads/"+type+"/"+fn;
  	var dir=process.cwd()+path
	pn.mv(dir,function  (err) {
	      if(err){
	       // console.log(err.sqlMessage)
	        //res.send(err)
	      }
	      if(callback){
	      	callback()
	      }
	      	
	 })
}
exports.upload_photo=upload_photo
function check_exists(data,phone,email,table,callback) {
	
	var q="SELECT *FROM "+table+" WHERE phone=?"
	connection.query(q,[phone],function (err,rst) {
		if(err)
		{
			return console.log(err.sqlMessage)
		}
		if(rst.length){
			var res=data.res;
			var data2={}

			data2.errmsg="The phone number \""+phone+"\" is already in use "
			return data.res.send(data2)
		
		}
		q="SELECT *FROM "+table+" WHERE email=?"
		connection.query(q,[email],function (err,rst) {
			if(err)
			{
				return console.log(err.sqlMessage)
			}
			if(rst.length){
				var res=data.res;
				var data2={}

				data2.errmsg="The email \""+email+"\" is already in use "
				return data.res.send(data2)
			
			}
			else
				callback()
		})

	})
}
exports.check_exists=check_exists;
exports.add_group_member=add_group_member;
function change_role(data,callback) {
	var req=data.req;
	var role=req.query.role;
	var id=req.query.id;
	var q="UPDATE group_members SET role=? WHERE id=?"
	connection.query(q,[role,id],function (err,rst) {

		callback()
	})
}
exports.change_role=change_role;
function remove_member(data,callback) {
	var req=data.req;
	var role=req.query.role;
	var id=req.query.id;
	var q="DELETE FROM group_members WHERE id=?"
	connection.query(q,[id],function (err) {
		if(err)
			console.log(err.sqlMessage)
		callback()
	})
}
exports.remove_member=remove_member

exports.get_user=function (username,callback) {
	var pref=username.substring(0,2).toUpperCase()
    username=username.substring(2,username.length)
    if(pref=="GM"){
      var type="group_members"
      var priv="gm"
      var table="group_members"
    }
    else if(pref=="SP"){
      var table="suppliers"
      var type="suppliers"
      var priv="supplier"
    }
    else if(pref=="AD"){
      var table="admins"
      var priv="admin"
      var type="admins"
    }
    else if(pref=="FD"){
      var table="funders"
      var priv="funder"
      var type="funders"
    }
    else{
      var priv="customer"
      var type="customers"
      table="customers"
    }
	var q="SELECT *FROM "+table+" WHERE username=? OR phone=?"
	connection.query(q,[username,username],function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		if(rst.length){
			var user=rst[0]
			user.table=table;
		}

		else
			var user=0;
		callback(user);
	})
}
function get_settings(data,callback) {
	var q="SELECT *FROM settings"
	connection.query(q,function (err,rst) {

		data.settings=rst[0]

		callback()
	})
}
exports.get_settings=get_settings
function get_districts(data,callback) {
	var res=data.res;
	var req=data.req;
	var q="SELECT DISTINCT district FROM districts_csp"
	connection.query(q,function (err,rst) {
		data.districts=rst;
		
		data.districts=rst;
		callback()

	})
}
exports.get_districts=get_districts
exports.get_counties=function (data) {
	var res=data.res;
	var req=data.req;
	var district=req.query.district;
	var q="SELECT DISTINCT county FROM districts_csp WHERE district=?"
	connection.query(q,[district],function (err,rst) {

		data.counties=rst;
		data.req=0;data.res=0;
		res.send(data)

	})
}
exports.get_subcounties=function (data) {
	var res=data.res;
	var req=data.req;
	var district=req.query.district;
	var county=req.query.county

	var q="SELECT DISTINCT sub_county FROM districts_csp WHERE district=? AND county=?"
	connection.query(q,[district,county],function (err,rst) {
		data.subcounties=rst;
		data.req=0;data.res=0;
		
		res.send(data)

	})
}
exports.get_parishes=function(data) {
	var res=data.res;
	var req=data.req;
	var district=req.query.district;
	var county=req.query.county
	var subcounty=req.query.subcounty

	var q="SELECT DISTINCT parish FROM districts_csp WHERE district=? AND county=? AND sub_county=?"
	connection.query(q,[district,county,subcounty],function (err,rst) {
		data.parishes=rst;
		data.req=0;data.res=0;
		res.send(data)

	})
}
var gen_random=function (n) {
  if(!n)
  	n=10

   var result           = '';
   var characters       = '123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < n; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
exports.gen_random=gen_random
function get_instock(data,callback) {
	
	var q="SELECT SUM(egg_stock.trays) AS stock FROM egg_stock  WHERE status='Pending Payment' OR status='Paid'"
	connection.query(q,function (err,rst) {
		if(err)
			return console.log(err)
		var allstock=rst[0].stock;
		if(allstock==null)
			allstock=0
		q="SELECT SUM(egg_orders.trays)/30 AS orders FROM egg_orders"
		connection.query(q,function (err,rst) {
			var allorders=rst[0].orders
			if(allorders==null)
				allorders=0
			var instock=allstock-allorders
			data.instock=Math.floor((instock)/30)
			data.instockb=instock
			
			callback()
		})
		
	})
}
exports.get_instock=get_instock;

function post_axios(parameters,callback) {
	var headers={
	    'Content-Type': 'application/json',
	    'Content-Length': JSON.stringify(parameters).length
	}
  if(parameters.url)
    var url=parameters.url;
  const axios = require('axios')
  axios
    .post(url, parameters,{headers:headers})
    .then(res => {
      callback(0,res)
      
    })
    .catch(error => {
      //console.error(error.errno)
      callback(error,0)
    })
}
exports.post_axios=post_axios;

function update_wallet(wd,callback) {
	var q="INSERT INTO wallet (account_no,amount,type,description,status,trans_id) VALUES(?,?,?,?,?,?)"
	connection.query(q,wd,function (err,rst) {
		if(err)
			console.log(err.sqlMessage)
		if(callback)
			callback()
	})
}
exports.update_wallet=update_wallet;
function get_wallet(data,callback) {
	var user=data.req.user;
	if(user.priv=="gm")
		var account_no="GM"+data.req.user.member_no
	if(user.priv=="supplier")
		var account_no="SP"+data.req.user.supplier_no
	var q="SELECT SUM(amount) AS amount,type FROM wallet WHERE account_no=? AND status='Completed' GROUP BY type ORDER BY type ASC"
	connection.query(q,[account_no],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		if(rst.length==0)
			data.wallet=0;
		else if(rst.length==1)
			data.wallet=rst[0].amount;
		else
			data.wallet=rst[0].amount-rst[1].amount;
		
		callback()
	})
}
exports.get_wallet=get_wallet;
exports.wallet_transactions=function(data,callback){
	var user=data.req.user;
	if(user.priv=="gm")
		var account_no="GM"+data.req.user.member_no
	if(user.priv=="supplier")
		var account_no="SP"+data.req.user.supplier_no
	var q="SELECT *,DATE_FORMAT(DATE_ADD(time_recorded,INTERVAL 8 HOUR),'%e %b %Y %l:%i %p') AS tr FROM wallet WHERE account_no=? ORDER BY time_recorded DESC"
	connection.query(q,[account_no],function (err,rst) {
		if(err)
			return console.log(err.sqlMessage)
		data.wallet_transactions=rst;
		callback()
	})

}

function mm_topup(data,callback) {
	var parameters=data.parameters
  var url="https://api.transpayug.com/v1/poultry/mobileMoneyTopup/"
  parameters.url=url;
  var phone=parameters.phone;
  parameters.phone="256"+phone.substring(1,phone.length)
  post_axios(parameters,function (err,rst) {
  	var errmsg=0
  	if(err){
  		errmsg="Unable to process mobile money payment"
  	}
  	if(rst)
  	{
  		
  		if(rst.data.data.status=="error"){
  			if(rst.data.data.msg=="Unrecogonised phone number"){
  				errmsg="Unable to process mobile money payment, incorrect phone number"
  			}
  			else{
  				errmsg="Unable to process mobile money payment"
  			}
  		}
  	}
  	callback(errmsg)
  })
}
exports.mm_topup=mm_topup



var check_mm_status=function(data,callback) {
  var parameters=data.parameters
  var url="https://api.transpayug.com/v1/poultry/mobileMoneyTopupStatus/"
  parameters.url=url;
  var phone=parameters.phone;
  
  parameters.phone="256"+phone.substring(1,phone.length)
  var headers={
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(parameters).length
  }
  post_axios(parameters,function(err,rst){

  	if(err){
  		if(err.errno=="ETIMEDOUT"){
  			var msg="Request timed out"
  		}
  		else
  			var msg=err.errno

  		return callback(0,'ETIMEDOUT',msg)
  	}
  	
  	var rdata=rst.data.data.data

  	if(rdata.length){
  		
  		var status=rdata[rdata.length-1].status;
  		var msg=rdata[rdata.length-1].message
  		if(msg=="TARGET_AUTHORIZATION_ERROR")
  			msg="Approval not made from phone"
  	}
 	else
 		status=0
  	if(status=="TOPUP-COMPLETED"){
  		callback(1,status,msg)
  	}
  	else if(status=="FAILED"||status==0){
  		callback(1,status,msg)
  	}
  	else if(status=="INPROCESS"){
  		callback(0,status,msg)
  	}
  	else{

  		callback(0,0,0)
  	}
  })
 
}

var parameters={
    "phone":"0757575431",
    "msg":"7147217421",
    "user":"2341166770"
}
var data={parameters:parameters}
//check_mm_status(data,function(){

//})
exports.check_mm_status=check_mm_status
exports.update_payment_status=function (order_no,status,phone,message,method,supplier_id,callback) {
	var q="UPDATE chicken_payments SET status=?,message=? WHERE order_no=?"
	var arr=[status,message,order_no]
	if(supplier_id){
		q="UPDATE chicken_payments SET status=?,message=?,supplier_id=? WHERE order_no=?"
		arr=[status,message,supplier_id,order_no]
	}
  connection.query(q,arr,function () {
    q="UPDATE supply_orders SET status=? WHERE group_order_no=?"
    connection.query(q,[status,order_no],function(){
      q="SELECT *FROM chicken_payments WHERE order_no=?"
      connection.query(q,[order_no],function (err,rst) {
      	var order_id=rst[0].id;
        var q="INSERT INTO supply_order_status (order_id,status,phone,message,method) VALUES (?,?,?,?,?)"
        
       	connection.query(q,[order_id,status,phone,message,method])
        if(callback)
        	callback()
      })
      
    })
  })
}

