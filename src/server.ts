import express,{Express} from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';
import bodyParser from 'body-parser';
import userRoutes from './routes/user_routes';

const initApp=()=> { 
 return new Promise<Express>((resolve,reject)=>{
const db= mongoose.connection;
db.on("error", (err)=>{
    console.log(err);
});
db.once("open",()=>{
    console.log("connected to MongoDB");

 // db.on("error", console.error.bind(console,"connection error:"));
// db.once("open",function(){ console.log("connected to the database")});

});


if(process.env.DB_CONNECT === undefined){
    console.error("DB_CONNECT is not set");
    reject();  
}else{
mongoose.connect(process.env.DB_CONNECT).then(()=>{
    console.log('initApp finish');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/users", userRoutes);


app.get("/about", (req,res)=>{
    res.send("About page");
});
resolve(app);

});
}
});
};
export default initApp;


