'use strict'
var mysql=require("mysql");
/*var db_url="uipevote_db"
var db_user="uipevote_user"
var db_host="localhost"
var db_pass="uipe102938"
*/
var db_url="poultrydb"
var db_user="root"
var db_host="127.0.0.1"
var db_pass=""
exports.db_url=db_url;
exports.db_user=db_user;
exports.db_host=db_host
exports.db_pass=db_pass
//=process.env.database_url

var connection=mysql.createConnection(
{
   host: db_host,
   user :db_user,
   password: db_pass,
   database:db_url,
   waitForConnections: true,
   connectionLimit:1000
})

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

