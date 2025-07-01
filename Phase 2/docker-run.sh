#!/bin/bash

# Check if port 80 is in use
if sudo netstat -tulpn | grep :80 > /dev/null; then
    sudo systemctl stop nginx 2>/dev/null || true

fi

sudo docker compose up -d

sleep 10

echo ""
echo "Service Status:"
sudo docker compose ps



