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
    goTo();
    
});

function goTo(all) {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Products for Sale":
          showAll();
          break;
  
        case "View Low Inventory":
          viewLow();
          break;
  
        case "Add to Inventory":
          addMore();
          break;
  
        case "Add New Product":
          addNew();
          break;
  
        }
      });
    }


function showAll() {
            var query = "SELECT item_id, product_name, price, stock_quantity FROM bamazon.products";
            connection.query(query, {}, function(err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("----");
                    console.log(
                        "Item ID: " +
                        res[i].item_id +
                        " Product: " +
                        res[i].product_name +
                        " Price: " +
                        res[i].price +
                        " Quantity: " +
                        res[i].stock_quantity
                    );
                }         
            });
      };

function viewLow() {
        var query = "SELECT item_id, product_name, price, stock_quantity FROM bamazon.products WHERE stock_quantity < 5";
        connection.query(query, {}, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log("----");
                console.log(
                    "Item ID: " +
                    res[i].item_id +
                    " Product: " +
                    res[i].product_name +
                    " Price: " +
                    res[i].price +
                    " Quantity: " +
                    res[i].stock_quantity
                );
            }         
        });
};

function addMore() {
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
          message: "Enter amount you want to add to stock: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ]).then(function(answer) {
        var query = "UPDATE bamazon.products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
        connection.query(query, [answer.amount, answer.itemid], function(err, res) {
                console.log("Product stock has been added.");          
        });
});
}

function addNew() {
    inquirer
      .prompt([
        {
            name: "product",
            type: "input",
            message: "Enter product name: ",            
          },
          {
            name: "department",
            type: "input",
            message: "Enter department name: ",            
          },
        {
          name: "price",
          type: "input",
          message: "Enter price: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "stock",
          type: "input",
          message: "Enter amount of product in stock: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
        
      ]).then(function(answer) {
        var query = 'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ( ?, ?, ?, ?)';
        connection.query(query, [answer.product, answer.department, answer.price, answer.stock], function(err, res) {
                console.log("Product has been added.");          
        });
});
}
               