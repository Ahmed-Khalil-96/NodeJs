const http = require('http');
const fs = require("fs");
const url = require('url');
const qs = require("querystring");

http.createServer(function(req,res){
    let r = url.parse(req.url, true);
    console.log(r);
    let fileName = '.' + r.pathname;
    if (fileName == './login.html') {
        if (r.search != null) {
            if(req.method == "GET"){
                res.writeHead(200,{'e':'e'});
                if(q.query.username == 'ahmed' && q.query.password == '123'){
                    res.write('login successfully')
                }else{
                    res.write('failed to login')
                }
                res.end()
            }
        }else{
            fs.readFile(fileName,function(err,data){
                res.writeHead(200,{'e':'e'});
                res.write(data);
                res.end()
            })
        }
        
    }else{
        fs.readFile(fileName,function(err,data){
            if (err) {
                res.writeHead(404, {'e': 'e'});
                return res.end('404 Not Found')
            }
            res.writeHead(200, {'e': 'e'});
            res.write(data);
            res.end()
        }
        
        )
    }
    
    
}).listen(8080);