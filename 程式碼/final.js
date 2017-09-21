var multer = require('multer');
var app = require('express')();
var http = require('http').Server(app);
var fs = require("fs");
var port = 7777;
var io = require('socket.io')(http);
var b = require('bonescript');
var a = 0;
var t;


var i2c = require('i2c');
var sleep = require('sleep');
var address = 0x1d;
var wire = new i2c(address, {device: '/dev/i2c-1'});


var exec = require('child_process').exec;
var cmd = './i2cInit';
exec(cmd, function(error, stdout, stderr) {
    console.log("Init i2c");
});



b.pinMode("P8_8", 'out');
b.digitalWrite("P8_8", 0);    


var upload = multer({ dest: '/upload/'});
 b.analogWrite('P9_14',0, 2000, printJSON);
 b.analogWrite('P9_16',0, 2000, printJSON);
 b.analogWrite('P9_22',0, 2000, printJSON);


app.get('/index', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

app.get('/canvasjs.min.js', function(req, res){
   res.sendFile(__dirname + '/canvasjs.min.js');
});

app.get('/a.jpg', function(req, res){
   res.sendFile(__dirname + '/a.jpg');
});

app.get('/home.jpg', function(req, res){
   res.sendFile(__dirname + '/home.jpg');
});
app.get('/rgb.jpg', function(req, res){
   res.sendFile(__dirname + '/rgb.jpg');
});

app.get('/led.png', function(req, res){
   res.sendFile(__dirname + '/led.png');
});

app.get('/assets/css/main.css', function(req, res){
   res.sendFile(__dirname + '/assets/css/main.css');
});

app.get('/images/pic10.jpg', function(req, res){
   res.sendFile(__dirname + '/images/pic10.jpg');
});

app.get('/assets/js/jquery.min.js', function(req, res){
   res.sendFile(__dirname + '/assets/js/jquery.min.js');
});

app.get('/assets/js/skel.min.js', function(req, res){
   res.sendFile(__dirname + '/assets/js/skel.min.js');
});

app.get('/assets/js/util.js', function(req, res){
   res.sendFile(__dirname + '/assets/js/util.js');
});

app.get('/assets/css/main.css', function(req, res){
   res.sendFile(__dirname + '/assets/js/main.css');
});

app.get('/assets/js/main.js', function(req, res){
   res.sendFile(__dirname + '/assets/js/main.js');
});

app.get('/assets/css/font-awesome.min.css', function(req, res){
   res.sendFile(__dirname + '/assets/css/font-awesome.min.css');
});

app.get('/i2c.html', function(req, res){
   res.sendFile(__dirname + '/i2c.html');
});

app.get('/gpio.html', function(req, res){
   res.sendFile(__dirname + '/gpio.html');
});

app.get('/image.html', function(req, res){
   res.sendFile(__dirname + '/image.html');
});

app.get('/pwm.html', function(req, res){
   res.sendFile(__dirname + '/pwm.html');
});

 

app.get('/assets/fonts/fontawesome-webfont.woff2', function(req, res){
   res.sendFile(__dirname + '/assets/fonts/fontawesome-webfont.woff2');
});


app.get('/assets/fonts/fontawesome-webfont.woff', function(req, res){
   res.sendFile(__dirname + '/assets/fonts/fontawesome-webfont.woff');
});

app.get('/assets/fonts/fontawesome-webfont.ttf', function(req, res){
   res.sendFile(__dirname + '/assets/fonts/fontawesome-webfont.ttf');
});

 

io.on('connection', function(socket){
    socket.on('R', function(msg){
    console.log('Red: ' + msg);
    io.emit('R',msg);
    b.analogWrite('P9_14', msg/10, 2000, printJSON);});
    
    socket.on('G', function(msg){
    console.log('Green: ' + msg);
    io.emit('G',msg);
    b.analogWrite('P9_16', msg/10, 2000, printJSON);});
    
    socket.on('B', function(msg){
    console.log('Blue: ' + msg);
    io.emit('B',msg);
    b.analogWrite('P9_22', msg/10, 2000, printJSON);});
    
    socket.on('gp1', function(msg){
        console.log('GPIO67: ' + msg);
       
        b.digitalWrite("P8_8", msg);    
        
    });
    
    socket.on('gp_add', function(msg){
        console.log('Add:'+msg);
       
        b.pinMode(msg, 'out');
        b.digitalWrite(msg, 0);  
        
    });
    
    socket.on('gp_on', function(msg){
        console.log('On:'+msg);
       
        b.digitalWrite(msg, 1);  
        
    });
    
      socket.on('gp_ff', function(msg){
        console.log('Off:'+msg);
       
        b.digitalWrite(msg, 0);  
        
    });
    
    
});

 setInterval(function() {
      wire.readBytes(0x05|0x80, 2, function(err, res) {
      var x=(res[0]<<4|res[1]<<12)>>4
      if((x&0x8000) == 0x8000)
         x=-((x^0xffff)+1);
      io.emit('temp',x/8+21);
      });
    
    }, 500);
    

function printJSON(x) { console.log(JSON.stringify(x)); }

http.listen(port, function(){
  console.log('listening on *' + port);
});


app.post('/image.html', upload.single('images'), function(req, res){
    
    
    console.log(req.file);
        if(req.file!=null){
            var file = __dirname + '/' + "a.jpg";
            
            fs.rename(req.file.path, file, function(err) {
                if (err) {
                  console.log(err);
                 
                } 
                else 
                {
                    console.log('Succ update');
                    io.emit('su',"?");
                }
            });
            
        }
    
  });

