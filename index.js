console.log(" backend script started")
const cors = require('cors');
const express = require("express");

const fs = require("fs");

const app = express();

let data = JSON.parse(fs.readFileSync("todo.json", "utf-8"));

app.use(express.json())
app.use(express());
app.use(cors());


// Create api creates a new todo --  CREATE
let create = function (req, res) {
  let newItem = req.body;
  if (data.length == 0) {
    // if the length is 0 adds a new item and assign a new id 1
    newItem = { id: 1, ...newItem };
  } else {
    // increment the id variable for new entry
    let lastSerial = data[data.length - 1].id;
    newItem = { id: lastSerial + 1, ...newItem };
  }
  data.push(newItem);
  let newData = JSON.stringify(data);
  fs.writeFile("todo.json", newData, function (err) {
    // write the new data object with added element bacck to the json file
    if (err) throw err;
    console.log("New entry added!");
  });
  res.send("New entry added!")
};

let read = function (req, res) {
  res.send(data);
};

let update = function (req, res) {
  let newItem = req.body;
  let id = req.body.id; // Gets the id from req body
  if (data.length == 0) {
    res.send("Nothing to update");
  } else {
    data.forEach((element) => {
      // logic to delete the item from data object
      if (element.id == id) {
        data.splice(id - 1, 1, newItem);
      }
      let newData = JSON.stringify(data);
      fs.writeFile("todo.json", newData, function (err) {
        // writing the file with the new data object
        if (err) throw err;
        console.log("Updated!");
      });
    });
  }
};
let deleteItem = function (req, res) {
  console.log("delete api clicked")
  let id = req.query.id
  console.log(id)
  if (data.length == 0) {
    res.send("Nothing to delete");
  } else {
    let flag = 0; // flag for invalid entry
    data.forEach((element) => {
      // logic to delete the item from data object
      if (element.id == id) {
        data.splice(id - 1, 1);
        data.forEach((element) => {
          //logic to decrement the value of id for all the element after the deleted element
          if (element.id > id) {
            element.id = element.id - 1;
          }
        });
        let newData = JSON.stringify(data);
        fs.writeFile("todo.json", newData, function (err) {
          // writing the file with the new data object
          if (err) throw err;
          console.log("Deleted!");
        });

        flag = 1;
        return;
      }
    });
    if (flag == 0) {
      // check for invalid ID
      res.send("Invalid Id");
    }
  }
};

app
  .post("/", create)
  .get("/", read)
  .put("/", update)
  .delete("/", deleteItem);

app.listen(8080);
