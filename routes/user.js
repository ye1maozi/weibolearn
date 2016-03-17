/**
 * Created by admin on 2016/3/17.
 */
 var express= require("express");
var router = express.Router();

router.get("/",function(req,res){
    res.send("respond with a resource");
});

module.exports = router;