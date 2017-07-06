var net = require('net');
var MODE = 'servo';
var HOST = 'localhost';
var PORT = 12345;

global.sock = null;

function connect() {
    global.sock = new net.Socket();
    global.sock.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
        global.sock.write(MODE);
    });

    global.sock.on('connect', function() {
        console.log('EVENT connect');
        //global.sock.write(MODE);
    });

    global.sock.on('data', function(data) {
        var val = (''+data).charCodeAt(0);
        console.log('EVENT data: ' + val);
    });

    global.sock.on('end', function() {
        console.log('EVENT end');
    });

    global.sock.on('timeout', function() {
        console.log('EVENT timeout');
    });

    global.sock.on('drain', function() {
        console.log('EVENT drain');
    });

    global.sock.on('error', function(error) {
        console.log('EVENT error:' + error);
        global.sock.destroy();
        global.sock = null;
    });

    global.sock.on('close', function(had_error) {
        console.log('EVENT close:' + had_error);
        global.sock = null;
    });
}

function keepalive() {
    if (null == global.sock) {
        connect();
    }
    d = String.fromCharCode(200);      // コントロールコードは180以上
    console.log('send:' + d);
    global.sock.write(d);
    setTimeout(keepalive, 5000);
}

function senddata() {
    if (null == global.sock) {
        connect();
    }
    //var rand = Math.floor( Math.random() * 180 )
    var rand = Math.floor( Math.random() * 256 );
    d = String.fromCharCode(rand);      // 1バイトの文字列（コード）にする
    //console.log('send:' + d);
    console.log('send:' + rand);
    global.sock.write(d);
    setTimeout(senddata, 1000);
}

connect();
setTimeout(keepalive, 5000);
setTimeout(senddata, 1000);
