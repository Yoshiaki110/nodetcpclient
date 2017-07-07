var net = require('net');
var HOST = 'localhost';
var PORT = 12345;

global.socks = new Array();     // �ڑ����Ă���\�P�b�g

function write(sock, data) {
    for (var i = global.socks.length; i--; ) {
        if (global.socks[i] != sock) {     // �����ȊO�ɑ��M
            global.socks[i].write(data);
        }
    }
}

function errorsock(sock) {
    console.log
    for (var i = global.socks.length; i--; ) {
        if (global.socks[i] === sock) {  // �Y���̃\�P�b�g���폜
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

    sock.on('data', function(data) {             // �P�o�C�g�Â���Ƃ͌���Ȃ�
        console.log(data);
        for (var i = data.length; i--; ) {
            var val = data[i];       // �������當���R�[�h�ɕϊ�
            console.log('EVENT data: ' + val);
            if (val > 180) {
                console.log('over');
            } else {
                console.log('under');
                var val = parseInt(data, 10)
                d = new Buffer(1);
                d[0] = data[i];
                write(sock, d);
                break;             // �Â��f�[�^�͎̂Ă�
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
