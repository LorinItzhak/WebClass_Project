import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import UserModel from "../models/user_model";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error("⚠️ Missing Google OAuth environment variables!");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL, 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔹 Google profile received:", profile);

        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("⚠️ Google profile is missing an email"), false);
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
          user = new UserModel({
            username: profile.displayName,
            email,
            googleId: profile.id,
            picture: profile.photos?.[0]?.value,
          });
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("❌ Error during Google OAuth authentication:", err);
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    console.error("❌ Error during user deserialization:", err);
    done(err, null);
  }
});

export default passport;
