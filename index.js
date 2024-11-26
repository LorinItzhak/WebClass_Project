const express= require ('express');
const app = express();
const dotenv= require("dotenv").config();
const port= process.env.PORT; 


const mongoose= require("mongoose");
mongoose.connect(process.env.DB_CONNECT);
const db= mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",function(){ console.log("connected to the database")});


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const postRoutes = require("./routes/posts_routes.js");
app.use("/posts", postRoutes);
app.listen(port, () =>{
    console.log(`Example app listening at http://localhost:${port}`);
});