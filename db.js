const mysql = require("mysql2");

// Create a pool of database connections
const pool = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "gritacademy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
