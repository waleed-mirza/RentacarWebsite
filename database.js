const { createPool, createConnection } = require("mysql");
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(express.json({ limit: "1mb" }));
const router = express.Router();
const cors = require("cors");
const PORT = process.env.port || 3000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static(path.join(__dirname, "/public")));
app.use("/files", express.static(path.join(__dirname, "/upload/images")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// router.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname + "/index.html"));
//   //__dirname : It will resolve to your project folder.
// });
// app.use("/", router);

// image storage ---start
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
});

// image storage ---end

const conn = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rentcar",
  multipleStatements: true,
});
conn.connect((err) => {
  if (err) {
    return console.log(err);
  }
  return console.log("connection established");
});

app.listen(PORT, () => console.log("express is running"));
// Get data from admin table
app.get("/login.html/authorize", (req, res) => {
  conn.query(`select * from admin`, (err, result, fields) => {
    if (err) {
      return console.log(err);
    }
    res.send(result);
  });
});
// Insert query
app.post("/admin.html/insert", upload.single("files"), (req, res) => {
  const item = req.body;
  item.image = `http://localhost:3000/files/${req.file.filename}`;
  const sqlQuery = `
  INSERT INTO items (name, charges, image) VALUES (?,?,?)`;
  conn.query(
    sqlQuery,
    [item.model, item.charges, item.image],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      res.send(result);
    }
  );
});
// Get all Data from items table
app.get("/admin.html/getitems", (req, res) => {
  conn.query(`select * from items`, (err, result, fields) => {
    if (err) {
      return console.log(err, "error in getting data from items");
    }
    return res.send(result);
  });
});
// Delete data froom item table
app.delete("/admin.html/delete", (req, res) => {
  conn.query(
    `delete from items where id = ?`,
    [req.body.id],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return res.send(result);
    }
  );
});
