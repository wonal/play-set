#!/bin/bash

serviceName="kestrel-playset.service"
serviceUser="setplayer"
sudo systemctl stop "$serviceName"
sudo rm "../$serviceUser/$serviceName" -r
sudo rm -r "/var/www/playset.alliwong.com/publish"
tar -xzvf publish.tar.gz
sudo mv publish "/var/www/playset.alliwong.com"
sudo systemctl disable "$serviceName"
sudo rm "/etc/systemd/system/$serviceName"
sudo mv "$serviceName" "/etc/systemd/system/$serviceName"
sudo systemctl daemon-reload
sudo systemctl enable "$serviceName"
sudo systemctl start "$serviceName"
sudo rm publish.tar.gz