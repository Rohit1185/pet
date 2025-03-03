const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/PETADOPTION")
.then(()=>console.log("Connection Sucessfull"))
.catch(()=>console.log("Error Whilte Connecting"))