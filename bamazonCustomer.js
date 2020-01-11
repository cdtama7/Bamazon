var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    showAll();
    
});

function showAll(all) {
    var query = "SELECT item_id, product_name, price FROM bamazon.products";
    connection.query(query, { all }, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("----");
            console.log(
                "Item ID: " +
                res[i].item_id +
                " Product: " +
                res[i].product_name +
                " Price: " +
                res[i].price
            );
        }         
    });
    userPurchase();
}

function userPurchase() {
    inquirer
      .prompt([
        {
          name: "itemid",
          type: "input",
          message: "Enter product id: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "amount",
          type: "input",
          message: "Enter amount you want to purchase: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        var query = "SELECT * FROM bamazon.products WHERE item_id = ?";
        connection.query(query, [answer.itemid], function(err, res) {
            if(answer.amount <= res[0].stock_quantity) {
                query2 = "INSERT INTO orders (item_id, amount, price, total) VALUES( ?, ?, ?, ?)";
                connection.query(query2, [answer.itemid, answer.amount, res[0].price, (answer.amount * res[0].price)], function(err, results) {
                    console.log("Your purchase totals $" + (answer.amount * res[0].price) + ".")
                })
                query3 = "UPDATE bamazon.products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
                connection.query(query3, [answer.amount, answer.itemid], function(err, res2) {
                })
                query4 = "UPDATE bamazon.products SET product_sales = product_sales + ? WHERE item_id = ?";
                connection.query(query4, [((answer.amount) * (res[0].price)), answer.itemid], function(err, res3) {
                })
            }
            else {
                console.log("Sorry, we don't have enough " + res[0].product_name + "(s) to sell you. You can purchase up to " + res[0].stock_quantity + ".")
            }
        });
      });
  }