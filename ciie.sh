#!/bin/bash
docker load -i ciie.tar
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -aq)
docker load -i ciie.tar
docker run -p 5000:5000 --add-host ciie.mysql.db:192.168.200.6 -d registry.cn-hangzhou.aliyuncs.com/kennisyoung/ciie_2019:v2