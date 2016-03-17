/**
 * Created by admin on 2016/3/15.
 */

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var partials = require("express-partials");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var settings = require("./settings");
var flash = require("connect-flash");

var routes = require("./routes/index.js");
var users = require("./routes/user");

//--start--
var app = express();

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(partials());
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.use(flash());

app.use(session({
    secret:settings.cookieSecret,
    store:new MongoStore({
        //db:settings.db
        url:"mongodb://localhost/"+settings.db
    })
}));
app.use(function(req,res,next){
   console.log("app usr local");
    res.locals.user = req.session.user;
    res.locals.post = req.session.post;
    var error = req.flash("err");
    res.locals.error = error.length?error:null;
    var success = req.flash("success");
    res.locals.success = success.length?success:null;
    next();
});
//--rounter--
app.use("/",routes);
//app.listen(3000);
app.listen(app.get("port"));
app.use("/users",users);
app.use(function(req,res,next){
   var err = new Error("not found");
    err.status = 404;
    next(err);
});

app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.render("error",{
        message:err.message,
        error:(app.get("env") == "development")?err:{}
    })
});

module.exports = app;
