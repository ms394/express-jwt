const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const queries = require("../queries");
const bcrypt = require("bcrypt");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
  algorithms: ["RS256"],
};

const verifyCallback = async (jwt_payload, done) => {
  try {
    const { email } = jwt_payload;
    const user = await queries.getUserByEmail(email);
    if (!user) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  } catch (err) {
    return done(err, false);
  }
};

const strategy = new JWTStrategy(options, verifyCallback);

passport.use(strategy);
