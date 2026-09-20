#!/bin/bash
# Deploys chasingachance.com by SSHing into the server and running its deploy.sh
# (git pull, npm install, generate:types, build, pm2 restart chancecms).
set -e

ssh luke@chasingachance.com 'cd /opt/services/clients/chasingachance/chancecms && ./deploy.sh'
