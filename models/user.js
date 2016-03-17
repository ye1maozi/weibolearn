/**
 * Created by admin on 2016/3/16.
 */
var mongodb = require("./db");

function User(user){
    this.name = user.name;
    this.password = user.password;
}

module.exports = User;

User.prototype.save = function(callback){
    var user = {
        name:this.name,
        password:this.password
    };

    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection("users",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                callback(err,user);
            })
        })
    })
};
User.get = function(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection("users",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //collection.findOne()
            collection.find({name:username}).limit(1).next(function(err,doc){
                mongodb.close();

                if(doc){
                    var user = new User(doc);
                    return callback(err,user);
                }else{
                    return callback(err,null);
                }
            })
        })

    })
};