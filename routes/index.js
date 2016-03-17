/**
 * Created by admin on 2016/3/15.
 */

var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var User = require("../models/user.js");
var Post = require("../models/post.js");

//main
router.get("/",function(req,res){
   Post.get(null,function(err,posts){
       if(err){
           posts = {};
       }
       console.log(posts.length);
       res.render("index",{
           title:"home",
           posts:posts,
           user:req.session.user,
           success:req.flash("success").toString(),
           error:req.flash("error").toString()
       });
   });
});

//register
router.get("/reg",checkNotLogin);
router.get("/reg",function(req,res){
    res.render("reg",{
        title:"register",
    });
});

router.post("/reg",checkNotLogin);
router.post("/reg",function(req,res){
    if(req.body["password-repeat"] != req.body["password"]){
        req.flash('error',"diff pw");
        return res.redirect("/reg");
    }
    console.log(req.body["password"]);

    var md5 = crypto.createHash("md5");
    var password = md5.update(req.body.password).digest("base64");

    var newUser = new User({
        name:req.body.username,
        password:password
    });

    User.get(newUser.name,function(err,user){
        if(user){
            err = "username already exists";
        }
        if(err){
            req.flash("error",err);
            return res.redirect("/reg");
        }

        newUser.save(function(err){
            if(err){
                req.flash("error",err);
                return res.redirect("/reg");
            }
            req.session.user = newUser;
            req.flash("success","register success");
            res.redirect("/");
        });
    });
});

//login
router.get("/login",checkNotLogin);
router.get("/login",function(req,res){
    res.render("login",{
        title:"login",
        error:req.flash("error").toString()
    });
});

router.post("/login",checkNotLogin);
router.post("/login",function(req,res){
    var md5 = crypto.createHash("md5");
    var password = md5.update(req.body.password).digest("base64");
    console.log(password)
    console.log(req.body)
    User.get(req.body.username,function(err,user){
        console.log(err);
        console.log(user);

        if(!user){
            req.flash("error","not exist");
            return res.redirect("/login");
        }
        if(user.password != password){
            req.flash("error","username/password error");
            return res.redirect("/login");
        }
        req.session.user = user;
        req.flash("success","login");
        res.redirect("/");
    });
});

//lonout
router.get("/logout",checkLogin);
router.get("/logout",function(req,res){
    req.session.user = null;
    req.flash("success","logout success");
    res.redirect("/");
});

function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash("error","logout");
        return res.redirect("/login");
    }
    next();
}
function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash("error","login");
        return res.redirect("/");
    }
    next();
}

//·¢ÑÔÂ·ÓÉ
router.post("/post",checkLogin);
router.post("/post",function(req,res){
    var currentUser = req.session.user;
    var post = new Post(currentUser.name,req.body.post);
    post.save(function(err){
        if(err){
            req.flash("error",err);
            return res.redirect("/");
        }

        req.flash("success","post success");
        res.redirect("/u/"+currentUser.name);
    });
});

router.get("/u/:user",function(req,res){
    console.log("search ..."+req.params.user);
    User.get(req.params.user,function(err,user){
        if(!user){
            req.flash("error","not exists");
            return res.redirect("/");
        }

        Post.get(user.name,function(err,posts){
            if(err){
                req.flash("error",err);
                return res.redirect("/");
            }
            res.render("user",{
                title:user.name,
                posts:posts,
            });
        });
    });
});
module.exports = router;
