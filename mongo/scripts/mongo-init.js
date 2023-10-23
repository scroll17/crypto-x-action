print('######### Start creating database #########');

const dbs = JSON.parse(process.env.MONGO_DBS)
dbs.forEach(function(dbName) {
  const username = process.env["MONGO_" + dbName.toUpperCase() + "_USERNAME"];
  const password = process.env["MONGO_" + dbName.toUpperCase() + "_PASSWORD"];

  print("Create DB: '" + dbName + "'");
  print("Create user for DB: '" + dbName + "' user: '" + username + "'");

  db = db.getSiblingDB(dbName)
  db.createUser({
    user: username,
    pwd: password,
    roles: [
      {
        role: "readWrite",
        db: dbName,
      },
    ],
  });
})

print('######### End creating database #########');
