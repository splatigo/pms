
var express  = require('express');
var routes   = require('./routes');
var admin=require("./routes/admin")
var auth=require("./routes/auth")
var db   = require('./routes/db');
var market=require("./routes/market")
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
app.get("/market",market.index)
app.get("/",routes.index)
app.post("/admin",admin.index)
app.get("/auth",auth.index)
app.post('/auth-sign',function(req, res, next) {
      passport.authenticate('user', function(err, user, info) {
      			
              if (err) { return next(err); }
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
  if(user.priv&&user.priv==1)
    res.redirect("/auth")
})
passport.use("user",new LocalStrategy(function(username,password,done){
    connection.query("SELECT *FROM users WHERE phone=? AND password=SHA1(?)",[username,password],function(err,rst){
            if(err){console.log("Error"+err); return done(err)}
            if(rst.length>0)
            {
                var user={id:rst[0]["id"],username:rst[0].username,password:password,name:rst[0].name,phone:rst[0].phone,gender:rst[0].gender,priv:rst[0].priv}
                return done(null,user);
            }
            else
            { 
                return done(null,false);
            }
    })
}));
passport.serializeUser(function(user, done) {
        var key = {
          id: user.id,
          type: user.type
        }
        done(null, key);
});
passport.deserializeUser(function(key,done){
    var id=key.id

	var q='SELECT *FROM users WHERE id=?';
	 connection.query(q,[id],function(err,rst){
	     
	       if(err){
	            return console.log(err)
	        }
	      var user={id:rst[0]["id"],username:rst[0]["username"],name:rst[0]["name"],gender:rst[0].gender,priv:rst[0].priv,phone:rst[0].phone}
	       done(null,user)
	 })
});//deserialize

function gen_pass() {
  
   var result           = '';
   var characters       = '123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


var server=app.listen(3000,function  () {
  console.log("App Listening on port 3000")
})