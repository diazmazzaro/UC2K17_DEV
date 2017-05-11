 var express = require("express");
 var fs = require('fs');
 var vm = require('vm');
 var app = express();

 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile('index.htm')
 });

  app.post("/user/add", function(req, res) { 
	/* some server side logic */
	res.send("OK");
  });

 app.get('*.shtml', function(req, res){
  console.log('adasd');
  var url = req._parsedUrl.pathname;
  url = url.substring(1, url.length - 6);
  //console.log(req);
  var jsPath = 'controllers/' + url + '.js';
  //console.log('jsPath ' + jsPath);
  if(fs.existsSync(jsPath)){
      var code = fs.readFileSync(jsPath);
      var context = vm.createContext({req : req, res : res, url : url, console : console});
      vm.runInContext(code, context, jsPath);
  } else {
      var url = req._parsedUrl.pathname;
      console.log('url request : ' + url);
      console.log('file request : ' + __dirname + req.params[0] + '.shtml');
      var code = fs.readFileSync( __dirname + req.params[0] + '.shtml', 'utf-8');
      
      res.send(code);
  }  
});

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });



 var port = process.env.PORT || 5004;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });

