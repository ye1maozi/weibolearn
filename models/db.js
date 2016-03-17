/**
 * Created by admin on 2016/3/16.
 */

var settings = require("../settings.js"),
    Db = require("mongodb").Db,
    Connection = require("mongodb").connect,
    Server = require("mongodb").Server;
//console.log(Connection);
var port = Connection.DEFAULT_PORT || 27017;
module.exports  = new Db(settings.db,new Server(settings.host,port,{}),{safe:true});
