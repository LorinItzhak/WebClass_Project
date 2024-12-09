import dotenv from "dotenv";
dotenv.config();
import initApp from "./server";
const port= process.env.PORT; 

 initApp().then((app)=>{
    console.log(process.env.PORT);  // זה צריך להחזיר את הפורט שהגדרת ב-.env

    app.listen(port, () =>{
        console.log(`Example app listening at http://localhost:${port}`);
 });
});
 