import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose, { Document } from "mongoose";
import userModel, { iUser } from "../models/user_model";

import { OAuth2Client } from "google-auth-library";




const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password: string): boolean => { 
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return re.test(String(password));
};



const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, picture } = req.body;
    //validate username
    if (username.length < 3) {
      res.status(400).send({ error: "Username must be at least 3 characters long" });
      return;
    }

    //check if username already exists
    const existingUsername = await userModel.findOne({ username: username });
    if (existingUsername) {
      res.status(401).send({ error: "Username already exists" });
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      res.status(400).send({ error: "Invalid email format" });
      return;
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).send({ error: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      picture: picture || "../../public/avatar.png"
    });
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ error: "Registration failed", details: err });
  }
};

const generateTokens = (user: iUser): { refreshToken: string, accessToken: string } | null => {
  if (process.env.TOKEN_SECRET === undefined) {
    return null;
  }
  const rand = Math.random();
  const accessToken = jwt.sign(
    {
      _id: user._id,
      rand: rand
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION });
  const refreshToken = jwt.sign(
    {
      _id: user._id,
      rand: rand
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
  return { refreshToken: refreshToken, accessToken: accessToken };
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  //check if user exists
  if (!username || !password) {
    res.status(400).send({ error: "Incorrect user name or password" });
    return;
  }

  try {
    const user = await userModel.findOne({ username: username });
    if (!user) {
      res.status(400).send({ error: "Incorrect user or password" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).send({ error: "Incorrect user or password" });
      return;
    }

    const tokens = generateTokens(user);
    if (!tokens) {
      res.status(500).send({ error: "Error generating tokens" });
      return;
    }

    if (user.refreshTokens == undefined) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.status(200).send({
      ...tokens,
      _id: user._id
    });
  } catch (err) {
    res.status(400).send({ error: "Login failed", details: err });
  }
};

const validateRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<Document<unknown, {}, iUser> & iUser>((resolve, reject) => {
    if (refreshToken == null) {
      reject("error");
      return;
    }
    if (!process.env.TOKEN_SECRET) {
      reject("error");
      return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
      if (err) {
        reject(err);
        return;
      }
      const userId = (payload as Payload)._id;
      try {
        const user = await userModel.findById(userId);
        if (!user) {
          reject("error");
          return;
        }
        //check if token exists
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          reject(err);
          return;
        }
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  });
}

const logout = async (req: Request, res: Response) => {
  try {
    const user = await validateRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(400).send("error");
      return;
    }
    //remove the token from the user
    user.refreshTokens = user.refreshTokens!.filter((token) => token !== req.body.refreshToken);
    await user.save();
    res.status(200).send("logged out");
  } catch (err) {
    res.status(400).send("error");
    return;
  }
};

const refresh = async (req: Request, res: Response) => {
  try {
    const user = await validateRefreshToken(req.body.refreshToken);

    const tokens = generateTokens(user);
    if (!tokens) {
      res.status(400).send("error");
      return;
    }
    user.refreshTokens = user.refreshTokens!.filter((token) => token !== req.body.refreshToken);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      ...tokens,
      _id: user._id
    });
  } catch (err) {
    res.status(400).send("error");
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    const { email, picture, username } = req.body;

  
    // Validate username
    if (username && username.length < 3) {
      res.status(400).send({ error: "Username must be at least 3 characters long" });
      return;
    }

    const user = await userModel.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    const user = await userModel.findByIdAndDelete(userId);
    if(user){
    res.status(200).send("User deleted");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

type Payload = {
  _id: string;
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const tokenHeader = req.headers["authorization"];
  const token = tokenHeader && tokenHeader.split(" ")[1];
  if (!token) {
    res.status(400).send("Access denied");
    return;
  }
  if (process.env.TOKEN_SECRET === undefined) {
    res.status(400).send("server error");
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      res.status(400).send("Access denied");
    } else {
      const userId = (payload as Payload)._id;
      req.params.userId = userId;
      next();
    }
  });
}



const client = new OAuth2Client();
const googleSignin = async (req: Request, res: Response) => {
   const credential = req.body.credential;
   try {
       const ticket = await client.verifyIdToken({
           idToken: credential,
           audience: process.env.GOOGLE_CLIENT_ID,
       });
       const payload = ticket.getPayload();
       console.log(payload);

       const email = payload?.email;
       let user = await userModel.findOne({ 'email': email });
       if (user == null) {
           user = await userModel.create(
               {
                   'username': payload?.name || email, // הוספת שם משתמש
                   'email': email,
                   'password': 'google-signin',
                   'picture': payload?.picture // הוספת תמונה
               });
       }
       const tokens = generateTokens(user);
       return res.status(200).send(tokens);

   } catch (err) {
       return res.status(400).send("error missing email or password");
   }
  };
 
  const checkUserExists = async (req: Request, res: Response): Promise<void> => {
    console.log("🔹 קיבלנו בקשה לבדוק משתמש");
    console.log("📩 פרמטרים שהתקבלו:", req.query);
  
    const { email, username } = req.query;
  
    if (!email || !username) {
      console.log("❌ missing email or username in request");
      res.status(400).json({ error: "Missing email or username in request" });
      return;
    }
  
    try {
      const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
  
      console.log("🔍 user found", existingUser ? "yes" : "no");
  
      if (existingUser) {
        res.status(200).json({ exists: true });
        return;
      }
      res.status(200).json({ exists: false });
    } catch (err) {
      console.log("❌ שגיאה בשרת:", err);
      res.status(500).json({ error: "Server error", details: err });
    }
  };
  
  export const getCurrentUser = (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({ user: req.user });
};






export default {
  register,
  login,
  refresh,
  logout,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  googleSignin,
  checkUserExists,
  authMiddleware,

}