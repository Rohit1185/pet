const express = require('express')
const app = express();
const cors = require("cors");
const registerUserRouter = require("./Router/registerUserRouter")
const path = require('path')
const dbconnect = require("./Config/dbconfig");

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/",registerUserRouter);
app.use('/uploads', express.static(path.join(__dirname+'/uploads')))
app.listen(8080,()=>{console.log("Server is running on Port 8080")})