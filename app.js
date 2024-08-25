const express = require("express");
const ejs = require("ejs");
const db = require("./db.js");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("index");
});
app.get("/students", async (req, res) => {
  let sql = "SELECT * FROM students";
  const dbData = await db.query(sql);
  res.render("students", { dbData });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
