var net = require('net');
var HOST = 'localhost';
var PORT = 12345;

global.socks = new Array();     // 接続しているソケット

function write(sock, data) {
    for (var i = global.socks.length; i--; ) {
        if (global.socks[i] != sock) {     // 自分以外に送信
            global.socks[i].write(data);
        }
    }
}

function errorsock(sock) {
    console.log
    for (var i = global.socks.length; i--; ) {
        if (global.socks[i] === sock) {  // 該当のソケットを削除
            global.socks.splice(i, 1);
        }
    }
}

server = net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    global.socks.push(sock)

    sock.on('connect', function() {
        console.log('EVENT connect');
    });

    sock.on('data', function(data) {             // １バイトづつ来るとは限らない
        console.log(data);
        for (var i = data.length; i--; ) {
            var val = data[i];       // 文字から文字コードに変換
            console.log('EVENT data: ' + val);
            if (val > 180) {
                console.log('over');
            } else {
                console.log('under');
                var val = parseInt(data, 10)
                d = new Buffer(1);
                d[0] = data[i];
                write(sock, d);
                break;             // 古いデータは捨てる
            }
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
        errorsock(sock);
    });

    sock.on('close', function(had_error) {
        console.log('EVENT close:' + had_error);
    });
})
server.listen(12345, 'localhost');
console.log('Server listening on ' + HOST +':'+ PORT);
