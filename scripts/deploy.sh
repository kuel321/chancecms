#!/bin/bash
# Deploys chasingachance.com by SSHing into the server and running its deploy.sh
# (git pull, npm ci, database backup, migrate, generate:types, build, pm2 restart).
# Commit schema migrations before deploying; they run automatically.
set -e

ssh luke@chasingachance.com 'cd /opt/services/clients/chasingachance/chancecms && ./deploy.sh'
