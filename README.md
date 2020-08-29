# nodetcpclient

46のテスト/デバッグプログラム

config.js

	exports.HOST = "192.168.1.210";;
	exports.PORT = 443;


/etc/systemd/system/enkaku.service

	[Unit]
	Description=enkakuoshaku server
	After=syslog.target network.target pigpio.target
	 
	[Service]
	Type=simple
	User=root
	WorkingDirectory=/home/pi/nodetcpclient
	ExecStart=/usr/local/nvm/versions/node/v5.4.0/bin/node /home/pi/nodetcpclient/server.js
	Restart=on-failure
	RestartSec=1
	KillMode=process
	 
	[Install]
	WantedBy=multi-user.target


確認

	sudo systemctl status enkaku


ログ

	sudo journalctl -f -u enkaku

