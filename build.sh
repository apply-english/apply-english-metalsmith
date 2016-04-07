#!/bin/bash

node index.js
sudo rm -rf /var/www/html/*
sudo cp -r ./build/* /var/www/html
sudo service nginx restart
