set -e

echo '######### Start creating database #########'

mongo <<EOF
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