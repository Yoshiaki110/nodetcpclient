/*
�t�H�[�}�b�g
0xFF, id, val(0-180)
*/
var net = require('net');
var HOST = 'localhost';
var PORT = 12345;
var ID = process.argv[2] || 1;
var SID = process.argv[3] || 2;
console.log('myID: ' + ID + 'sendID: ' + SID);
var MODE = process.argv[4] || 's';

global.sock = null;

function connect() {
    global.sock = new net.Socket();
    global.sock.setNoDelay();
    global.sock.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    });

    global.sock.on('connect', function() {
        console.log('EVENT connect');
    });

    global.sock.on('data', function(data) {
        if (data.length >= 3) {    // �R�o�C�g�ȏ�̃f�[�^�̂ݎg�p
            var p = -1;
            for (var i = data.length - 2; i--; ) {
//                console.log(data[i]);
                if (data[i] == 255) {
                    p = i;
                }
            }
            if (p >= 0) {                      // �������f�[�^����
                if (data[p+1] == ID) {         // �������Ẵf�[�^
                    console.log('* receive id:' + data[p+1] + ' val:' + data[p+2] + ' len:' + data.length);
                    d = new Buffer(3);         // �G�R�[�o�b�N���M
                    d[0] = 255;
                    d[1] = data[p+1];
                    d[2] = data[p+2];
                    global.sock.write(d);
                } else if (data[p+1] == SID) { // �G�R�[�o�b�N��M
                    console.log('e receive id:' + data[p+1] + ' val:' + data[p+2] + ' len:' + data.length);
                } else {
                    console.log('  receive id:' + data[p+1] + ' val:' + data[p+2] + ' len:' + data.length);
                }
            } else {
                console.log('receive not found separater. data len:' + data.length);
            }
        } else {
            console.log('receive illegal data len:' + data.length);
        }
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
    d = new Buffer(3);
    d[0] = 255;
    d[1] = SID;
    d[2] = 200;
    console.log('send keepalive:' + 200);
    global.sock.write(d);
    setTimeout(keepalive, 5000);
}

function senddata() {
    if (null == global.sock) {
        connect();
    }
    //var rand = Math.floor( Math.random() * 180 )
    var rand = Math.floor( Math.random() * 256 );
    //d = String.fromCharCode(rand);      // 1�o�C�g�̕�����i�R�[�h�j�ɂ���
    d = new Buffer(3);
    d[0] = 255;
    d[1] = SID;
    d[2] = rand;
    //console.log('send:' + d);
    console.log('send:' + rand);
    global.sock.write(d);
    setTimeout(senddata, 1000);
}

connect();
if (MODE != 'r') {
    setTimeout(keepalive, 5000);
    setTimeout(senddata, 1000);
}
