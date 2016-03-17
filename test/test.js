/**
 * Created by admin on 2016/3/17.
 */
var User = require("../models/user.js");
var Post = require("../models/post.js")
var user1 ;
Post.get("hello",function(err,doc){
    if(err) {
        console.log(err);
        console.log(12333)
    }else if(doc){
console.log(doc)
        console.log(222);
        user1 = new Post(doc);
        user1.user = "hello"
        user1.post = "123123123";
        user1.time = new Date();
        console.log(user1);
        user1.save(function(err,post){

        })
    }else{
        console.log(123);
        user1 =  new Post({
            name:"hello",
            password:"123456",
            time:new Date()
        });
        console.log(user1)
        user1.save(function(err,doc){
            if(err) {
                console.log(err);
            }else{
                console.log(doc);
            }
        });

    }

});
