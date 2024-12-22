import { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).send(user);

  } catch (err) {
    res.status(400).send(err);
  
  }
  
}

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(400).send("incorrect email or password");
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).send("incorrect email or password");
      return;
    }
    if (process.env.TOKEN_SECRET === undefined) {
      res.status(400).send("server error");
      return;
    }
    const random = Math.floor(Math.random() * 1000000);
    const accessToken= jwt.sign(
      { _id: user._id,
        random:random 
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION });
      
      
      const refreshToken= jwt.sign(
        { _id: user._id,
          random: random
         },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

        if (user.refreshTokens == null) {
          user.refreshTokens = [];
        }
        user.refreshTokens.push(refreshToken);
        await user.save();

          res.status(200).send(
             { accessToken: accessToken,
              refreshToken: refreshToken, 
              email: user.email,
              _id: user._id
             });
        
      
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

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
      res.status(400).send("missing refresh token");
      return;
  }
  //first validate the refresh token
  if (!process.env.TOKEN_SECRET) {
      res.status(400).send("missing auth configuration");
      return;
  }
  jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, data: any) => {
      if (err) {
          res.status(403).send("invalid token");
          return;
      }
      const payload = data as Payload;
      try {
          const user = await userModel.findOne({ _id: payload._id });
          if (!user) {
              res.status(400).send("invalid token");
              return;
          }
          if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
              res.status(400).send("invalid token");
              user.refreshTokens = [];
              await user.save();
              return;
          }
          const tokens = user.refreshTokens.filter((token) => token !== refreshToken);
          user.refreshTokens = tokens;
          await user.save();

          res.status(200).send("logged out");
      } catch (err) {
          res.status(400).send("invalid token");
      }
  });
};


 const refresh = async (req: Request, res: Response) => {
//   const tokenHeader = req.headers["authorization"];
//   const token = tokenHeader && tokenHeader.split(" ")[1];
//   if (!token) {
//     res.status(400).send("Access denied");
//     return;
//   }
//   if (process.env.TOKEN_SECRET === undefined) {
//     res.status(400).send("server error");
//     return;
//   }
//   jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
//     if (err) {
//       res.status(400).send("Access denied");
//     } else {
//       const userId = (payload as Payload)._id;
//       jwt.sign({ _id: userId },
//         process.env.TOKEN_SECRET,
//         { expiresIn: process.env.TOKEN_EXPIRATION }, (err, token) => {
//           if (err) {
//             res.status(400).send("server error");
//           } else {
//             res.status(200).send({ token: token, _id: userId });
//           }
//         });
//     }
  // });
}

export default {
  register,
  login,
  logout,
  refresh
}