var net = require('net');
var HOST = 'localhost';
var PORT = 12345;

global.sock = null;

server = net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('connect', function() {
        console.log('EVENT connect');
    });

    sock.on('data', function(data) {             // todo １バイトづつ来るとは限らない
        var val = (''+data).charCodeAt(0);       // 文字から文字コードに変換
        console.log('EVENT data: ' + val);
        if (val > 180) {
        } else {
            var val = parseInt(data, 10)
            sock.write((''+data));
        }
    });

    sock.on('end', function() {
        console.log('EVENT end');
    });

    sock.on('timeout', function() {
        console.log('EVENT timeout');
    });

    sock.on('drain', function() {
        console.log('EVENT drain');
    });

    sock.on('error', function(error) {
        console.log('EVENT error:' + error);
    });

    sock.on('close', function(had_error) {
        console.log('EVENT close:' + had_error);
    });
})
server.listen(12345, 'localhost');
console.log('Server listening on ' + HOST +':'+ PORT);
