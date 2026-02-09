const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_auth"
});

db.connect(err => {
  if (err) {
    console.log("❌ DB Connection Failed");
  } else {
    console.log("✅ DB Connected Successfully");
  }
});

module.exports = db;
