/**
 * Created by admin on 2016/3/15.
 */

if(process.env.DEBUG){
    var debug = require("debug")("blog");
}else{
    //未设置环境变量debug--》webstorm查看
    var util = require("util");
    var debug = function(){
        var log = '\x1b[36m'+ 'blog' +'\x1b[0m'  + "  ";
        log += util.format.apply(this, arguments);
        var date = new Date();
        log += '  \x1b[36m'+ date.toTimeString()+"  "+ date.getMilliseconds() +'ms\x1b[0m'  + "  ";
        console.log(log);
    }
}
var app = require("../app");
//debug("aaa%s",'b');
//console.log(112321);
//console.log(process.argv)
app.set("port",process.env.PORT || 3000);
var server = app.listen(app.get("port"),function(){
   debug('server listen ... '+ server.address().port);
});