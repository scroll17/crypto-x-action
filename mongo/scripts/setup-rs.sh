#!/bin/bash

set -e

echo "*********************(" ${MONGO_CONTAINER_NAME} ":" ${MONGO_PORT} ")*********************"
echo "Waiting for startup.."
until curl http://${MONGO_CONTAINER_NAME}:${MONGO_PORT}/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  printf '.'
  sleep 1
done

echo '######### Start creating REPLICA SET #########'

# use "mongosh" instead of "mongo" for newer versions
echo SETUP.sh time now: `date +"%T" `
mongo --host "${MONGO_CONTAINER_NAME}:${MONGO_PORT}" <<EOF

var cfg = {
    "_id": "rs0",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "${MONGO_CONTAINER_NAME}:${MONGO_PORT}",
            "priority": 1
        }
    ],
    settings: {
    	chainingAllowed: true
    }
};


rs.initiate(cfg, { force: true });
rs.reconfig(cfg, { force: true });

db.getMongo().setReadPref('nearest');

rs.status();
EOF
echo '######### End creating REPLICA SET #########'

# DB

echo '######### Start creating database #########'
mongo --host "${MONGO_CONTAINER_NAME}:${MONGO_PORT}" <<EOF
use $MONGO_MAIN_DATABASE

db.createUser({
  user: '$MONGO_MAIN_USERNAME',
  pwd: '$MONGO_MAIN_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$MONGO_MAIN_DATABASE'
  }]
})
EOF
echo '######### End creating database #########'