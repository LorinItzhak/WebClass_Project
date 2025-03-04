import express,{Express} from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';
import likeRoutes from './routes/likes_routes';
import  { NextFunction, Request, Response } from "express";
import bodyParser from 'body-parser';
import userRoutes from './routes/user_routes';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from "swagger-ui-express";
import fileRouter from "./routes/file_routes";
import cors from 'cors';
import passport from "./config/passport-config";
import session from "express-session";




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



const delay = (req: Request, res: Response, next: NextFunction) => {
    const d = new Promise<void>((r) => setTimeout(() => r(), 2000));
    d.then(() => next());
  };
  app.use("/posts", delay, postsRoutes);
  app.use("/comments", delay, commentsRoutes);
  app.use("/users", delay, userRoutes);
  app.use("/likes", delay, likeRoutes);

  app.use("/file", fileRouter);
  app.use("/public", express.static("public"));
  app.use("/storage", express.static("storage"));
  app.use(express.static("front"));
  app.use("/avatar.png", express.static("public/avatar.png"));

  app.use(session({
    secret: process.env.TOKEN_SECRET!,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());






// app.use(cors({
//   origin: 'http://localhost:5173',  // frontend url
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });


// app.use(cors({
//     origin: "http://localhost:5173", // התאימי לכתובת של ה-Frontend שלך
//     credentials: true
// }));

 

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: " Project Web Dev 2025 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT (API for user authentication, post management, and comments)",
      },
      servers: [{ url: "http://localhost:3003", },],
    },
    apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// Swagger setup
// const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const initApp=()=> { 
    console.log('initApp start');    
    return new Promise<Express>((resolve,reject)=>{
        const db= mongoose.connection;
        db.on("error", (err)=>{
            console.log(err);
        });
        db.once("open",()=>{
            console.log("connected to MongoDB");
        });

        if(process.env.DB_CONNECT === undefined){
            console.error("DB_CONNECT is not set");
            reject();  
        }else{
            mongoose.connect(process.env.DB_CONNECT).then(()=>{
                console.log('initApp finish');
                app.get("/about", (req,res)=>{
                    res.send("About page");
                });
                resolve(app);
            });
        }
    });
};
export default initApp;


