
var express  = require('express');
var routes   = require('./routes');
var admin=require("./routes/admin")
var auth=require("./routes/auth")
var db   = require('./routes/db');
var market=require("./routes/market")
var group_portal=require("./routes/group-portal")
//var bodyParser = require('body-parser')
var http = require('http');
var path = require('path');
var mysql=require("mysql");
var db_url=db.db_url
var db_user=db.db_user
var db_host=db.db_host
var db_pass=db.db_pass
var connection=mysql.createConnection(
{
   host: db_host,
   user :db_user,
   password: db_pass,
   database:db_url,
   waitForConnections: true,
   connectionLimit:1000
})
var flash=require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs=require('fs');
//var ip=require("ip")
//var cors = require('cors')
var multer  = require('multer')
var fileUpload = require('express-fileupload');
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
var cookieParser=require("cookie-parser")
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());
app.get("/gen",db.index)
app.get("/market",market.index)
app.get("/group",group_portal.index)
app.post("/group",group_portal.index)
app.get("/",routes.index)
app.post("/admin",admin.index)
app.get("/admin",admin.index)
var supplier=require("./routes/supplier")
app.post("/supplier",supplier.index)
app.get("/supplier",supplier.index)
app.get("/auth",auth.index)
app.get("/api/pay",function(req,res){
  pay_callback(req,res)

})
app.post('/auth-sign',function(req, res, next) {
      passport.authenticate('user', function(err, user, info) {
              
              if (err) { return next(err);}

              if (!user) { 
                res.send({msg:"fail"})
                return 0;
              }
              req.logIn(user, function(err) {
                res.cookie("user",user)
                res.send({msg:"ok",user:user})
                     
              });
      })(req, res, next);   
})

app.get("/signout",function (req,res) {
  if(req.cookies.user){

    var user=req.cookies.user;
    if(typeof user=="string")
      user=JSON.parse(user)
  }
  else
    var user=req.user;
  req.logout()
  res.cookie("user","")
  res.redirect("/")
})

passport.use("user",new LocalStrategy(function(username,password,done){
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
    else if(pref=='FD'){
      var table="funders"
      var priv="funder"
      var type="funders"

    }
    else{
      var priv="customer"
      var type="customers"
      table="customers"
    }


    connection.query("SELECT *FROM "+table+" WHERE (phone=? OR username=?) AND password=SHA1(?)",[username,username,password],function(err,rst){
            if(err){
              return console.log(err.sqlMessage); 
            //return done(err)
          }
            if(rst.length>0)
            {
                var user=rst[0]
                user.priv=priv
                user.type=type
                return done(null,user);
            }
      
            else{
               return done(null,false);
            }
    })
}));
passport.serializeUser(function(user, done) {
        var key = {
          id: user.id,
          type: user.type,
          priv:user.priv
        }
        done(null, key);
});
passport.deserializeUser(function(key,done){
    var id=key.id

  var q="SELECT *FROM "+key.type+" WHERE id=?";
   connection.query(q,[id],function(err,rst){
   var user=rst[0];
   user.priv=key.priv;

   if(err){
              return console.log(err)
     }
      return done(null,user);
   })
});//deserialize

function gen_pass(n) {
  
   var result           = '';
   var characters       = '123456789';
   var charactersLength = characters.length;
   if(!n)
    n=6

   for ( var i = 0; i < n; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
app.get("/testmm",function (req,res) {
  test_mm(req,res)
  res.end("Done!")
})
app.get("/checkmm",function(req,res){
  check_mm_status(req,res)
})
function check_mm_status(req,res) {
  var phone="256757575431"
  var transactionId=gen_pass(15)
  var desc="Payment"
  var parameters={
    "phone":"256705687760",
    "msg":"Testing1",
    "user":"2341166770"
  }
  var headers={
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(parameters).length
  }
  post_axios(parameters)
  res.end("Done!")
}
app.get("/checkdetails",function(req,res){
  check_details(req,res)
})
function check_details(req,res) {
  var transactionId=gen_pass(15)
  var parameters={
    "transaction_number": "TP0003686340",
    "user":"2341166770"
  }
  var headers={
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(parameters).length
  }
  post_axios(parameters)
  res.end("Done!")
}

app.get("/verify_phone",function(req,res){
  verify_phone(req,res)
})
function verify_phone(req,res) {
  var transactionId=gen_pass(15)
  var parameters={
    "phone": "256757575431",
    "user":"2341166770"
  }
  var headers={
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(parameters).length
  }
  post_axios(parameters)
  res.end("Done!")
}

app.get("/payout",function(req,res){
  pay_out(req,res)
})
function pay_out(req,res) {
  var transactionId=gen_pass(15)
  var parameters={
    "phone": "256757575431",
    "amount":"500",
    "user":"2341166770",
    "msg":"API Testing1",
    "name":"Simon Latigo",
    url:"https://api.transpayug.com/v1/poultry/mobileMoneyWithdraw/"
  }
  var headers={
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(parameters).length,
      'Authorization':'Basic MjM0MTE2Njc3MDpibGVzc2VkMQ=='
  }
 
  post_axios(parameters,headers)
  res.end("Done!")
}

app.get("/check_balance",function(req,res){
  check_balance(req,res)
})
function check_balance(req,res) {
  var transactionId=gen_pass(15)
  var parameters={
    "username":"2341166770",
    url:"https://api.transpayug.com/v1/poultry/balance/"
  }
  var headers={
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(parameters).length
  }
  post_axios(parameters)
  res.end("Done!")
}


function test_mm(req,res) {
  var url = "https://vendors.pay-leo.com/api/v2/test/deposit";
  var phone="256757575431"
  var amount="500"
  var transactionId=gen_pass(15)
  var desc="Payment"
  var parameters={
    "phone":"256705687760",
    "amount":"500",
    "msg":"Testing1",
    "user":"2341166770"
  }
  var headers={
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(parameters).length
  }
  //post_req(parameters,hostname,path,headers)
  post_axios(parameters,res)
}

function pay_callback(req,res) {
  //var order_no=req.query.otherData
  var q="UPDATE chicken_payments SET status='Pending Delivery' WHERE order_no"
  connection.query(q,[order_no],function (err,rst) {
    
  })
}
function post_axios(parameters,headers) {
  //var url="https://api.transpayug.com/v1/poultry/mobileMoneyTopupStatus/"
  //var url="https://api.transpayug.com/v1/poultry/mobileMoneyTopup/"
  //var url="https://api.transpayug.com/v1/poultry/transactionDetails/"
  var url="https://api.transpayug.com/v1/poultry/verifyMobileMoneyPhoneNumber/"
  if(parameters.url)
    url=parameters.url;
  const axios = require('axios')
  axios
    .post(url, parameters,{headers:headers})
    .then(res => {
      console.log(res.data.data)
      
    })
    .catch(error => {
      console.error(error)
    })
}
function post_req(parameters,hostname,path,headers) {
  const querystring = require('querystring');
  const get_request_args = querystring.stringify(parameters);
  const options = {
    hostname: hostname,
    port:443,
    path: path + get_request_args,
    method: 'POST',
    headers:headers
  }
  const request = http.request(options, (response) => {
    // response from server
    console.log(response)
   
  });

  // In case error occurs while sending request
  request.on('error', (error) => {

    console.log(error.message);
  });

  request.end();
}
function signHmacSha256(key, str) {
  const crypto = require("crypto");
  let hmac = crypto.createHmac("sha256", key);
  let signed = hmac.update(Buffer.from(str, 'utf-8')).digest("hex");
  return signed
}
var server=app.listen(3000,function  () {
  console.log("App Listening on port 3000")
})