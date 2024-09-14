console.log(" backend script started")
const cors = require('cors');
const express = require("express");
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ManishJoshi123";

const fs = require("fs");
const { dirname } = require('path');

const app = express();

let data = JSON.parse(fs.readFileSync("todo.json", "utf-8"));
let user = []
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
function signup(req,res){
  const username = req.body.username;
  const password = req.body.password;
  let foundUser = user.find(i=>i.username === username)
  if(foundUser){
    res.send("user exist")
  }
  else{
    user.push({
      username,
      password
    })
    res.send({
      messege: "user created"


    })
  }

}

function signin(req,res){
  console.log("signin form backend")
  const username = req.body.username;
  const password = req.body.password;
  let foundUser = user.find(i=>i.username === username)
  console.log("Inside password"+foundUser)
  if(foundUser.password===password)
  {
    const token=jwt.sign(username,JWT_SECRET)
    res.send({
      token
    })
  }
  else{
    res.send({
      "messege":"invalid Credentials"
    })
  }
}
function auth(req,res,next){
  const token = req.header.token;
  console.log(token)
  const username=jwt.verify(token,JWT_SECRET)

}
app.post("/signup",signup);
app.post("/signin",signin);
app.get("/home",function (req,res){

  console.log("home end point")
  try{

    const token = req.headers.token;
    console.log(token)
    const username=jwt.verify(token,JWT_SECRET)
    let foundUser= user.find(u=>u.username===username)
  }
  catch(err){
    res.send({
      "messege":"Invalid token"
    })
  }
  if(foundUser){
    
    console.log(username)
    res.sendFile(__dirname+"/public/frontend/Home.html")
  }


  else{
    res.send({
      "messege":"Invalid token"
    })
  }









})


app
  .post("/create", create)
  .get("/todo", read)
  .put("/update", update)
  .delete("/delete", deleteItem);

app.listen(8080);



