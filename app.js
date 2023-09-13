/** @format */

const express = require("express");
const mySql = require("mysql2");
const http = require("http");
const { userInfo } = require("os");
const path = require("path");
const { throws } = require("assert");
var cors = require("cors");
let app = express();
app.listen(2001, (req, res) => {
  console.log("server listening");
});
app.use(cors());
const DBconnection = mySql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "myDBuser",
  database: "myDB",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});
// netstat -ln | grep mysql --path finder
DBconnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});
// Question 2: Here is a link to a document that contains the tables we need to create and convert the apple.com/iphones page into a dynamic page with a database. As you can see from the document, there are 5 tables that are needed (please scroll horizontally and vertically over the document to see all the 5 tables). Write a SQL query to create the apple.com tables inside of the "myDB" database you created above. Once you write the queries, use the "mysql" module to execute the queries on the database. Try both of these methods to initiate the execution of the queries:
// ● Include the execution code directly in the module to be executed as you run the app
// ● Use the Express module to receive requests. Configure your module in a way that it executes the queries when the "/install" URL is visited.
// Please find further instructions under the “Instructions for question 2” below.

app.get("/create_table", function (req, res) {
  let createProduct = `CREATE TABLE if not exists products(product_id Int auto_increment, 
    Product_url varchar(255) not null,
        product_name varchar(255) not null,
        PRIMARY KEY (product_id))`;
  let createProductDescription = `CREATE TABLE if not exists ProductDescription(Description_id int auto_increment, 
        product_id int(11) not null, 
        product_brief_description TEXT not null, product_description TEXT not null,
        product_img varchar(255) not null,
        product_link varchar(255) not null,
        PRIMARY KEY (description_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id))`;
  let createproductPrice = `CREATE TABLE if not exists productPrice(price_id int auto_increment, 
        product_id int(11) not null,
        starting_price varchar(255) not null,
        price_range varchar(255) not null,
        PRIMARY KEY (price_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id))`;
  let createUser = `CREATE TABLE if not exists user(user_id int auto_increment, 
        user_name varchar(255),
        user_password varchar(255),
        PRIMARY KEY (user_id))`;
  let createOrders = `CREATE TABLE if not exists Orders(order_id int auto_increment, 
        product_id int(11) not null,
        user_id int(11) not null,
        PRIMARY KEY (order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        FOREIGN KEY (user_id) REFERENCES user(user_id))`;
  DBconnection.query(createProduct, (err, results, fields) => {
    if (err) {
      console.log(err);
    }
  });
  DBconnection.query(createProductDescription, (err, results, fields) => {
    if (err) {
      console.log(err);
    }
  });
  DBconnection.query(createproductPrice, (err, results, fields) => {
    if (err) {
      console.log(err);
    }
  });
  DBconnection.query(createUser, (err, results, fields) => {
    if (err) {
      console.log(err);
    }
  });
  DBconnection.query(createOrders, (err, results, fields) => {
    if (err) {
      console.log(err);
    }
  });
  res.end("table Created");
});

bodyParser = require("body-parser");
cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post("/add-product", function (req, res) {
  // const {productId, produnctUrl, productName} = req.body
  console.log(req.body);

  let productUrl = req.body.productUrl;
  let productName = req.body.productName;
  let pBrief = req.body.productBrief;
  let pDescription = req.body.productDescription;
  let pimg = req.body.pimg;
  let pLink = req.body.pLink;
  console.log(req.body);

  //   console.log(productId);
  // insert into [table Name](columns) value()

  let insertProduct = `INSERT INTO products (product_url, product_name) VALUE(' ${productUrl} ','${productName}')`;

  //
  // let insertPName=`INSERT INTO products () VALUE(?)`
  DBconnection.query(insertProduct, function (err, res) {
    if (err) throw err;
    // console.log(res.insertID);
    console.log("one record inserted");
  });

  let selectId = `SELECT * FROM products`;
  DBconnection.query(selectId, (error, rows, fields) => {
    // console.log(rows);
    // console.log(fields)
    if (error) throw error;
    let productId = 0;
    productId = rows[rows.length - 1].product_id;

    console.log(productId);
    // console.log(userId);

    if (productId != 0) {
      let insertDecription = `INSERT INTO ProductDescription (product_id, product_brief_description, product_description, product_img, product_link) VALUE ('${productId}', ' ${pBrief}', ' ${pDescription}', ' ${pimg}', '${pLink}')`;
      DBconnection.query(insertDecription, function (err, res) {
        if (err) throw err;
        console.log("second record inserted");
      });
      let DecendOrder = `SELECT * FROM ProductDescription ORDER BY Description_id DESC`;
      DBconnection.query(DecendOrder, (err, res) => {
        if (err) throw err;
      });

      let startPrice = req.body.startingPrice;
      let priceRange = req.body.priceRange;
      let insertPrice = `INSERT INTO productPrice(product_id, starting_price, price_range) VALUE ('${productId}', '${startPrice}', '${priceRange}')`;
      DBconnection.query(insertPrice, function (err, res) {
        if (err) throw err;
        console.log("third record inserted");
      });
      let userName = req.body.userName;
      let uPassword = req.body.Password;
      console.log(userName);
      if (userName == "") {
        console.log("no Value for user name");
      } else {
        let insertUser = `INSERT INTO user(user_name, user_password) VALUE('${userName}', '${uPassword}')`;
        DBconnection.query(insertUser, function (err, res) {
          if (err) throw err;
          // console.log(rows[rows.length-1].user_name)
          console.log(res);
          console.log("fourth record inserted");
        });
        let selectUID = `SELECT * FROM user`;
        DBconnection.query(selectUID, (error, rows, fields) => {
          let userId = rows[rows.length - 1].user_id;

          let insertOrder = `INSERT INTO Orders(product_id, user_id) VALUE('${productId}','${userId}' )`;

          DBconnection.query(insertOrder, function (err, res) {
            if (err) throw err;
            console.log("Fifth record inserted");
          });
        });
      }
      // console.log(rows);
      //
    }
  });
  res.end("it is working");
});
app.get("/products", function (req, res) {
  let mysqlJson = `SELECT *
FROM Products
JOIN ProductDescription 
JOIN productPrice ON Products.product_id = ProductDescription.product_id AND Products.product_id =productPrice.product_id`;
  DBconnection.query(mysqlJson, (err, rows, field) => {
    if (err) throw err;
    let DBJson = rows;
    console.log(DBJson);
    res.send(DBJson);
  });
});
