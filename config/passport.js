const passport = require("passport");
const { Strategy } = require("passport-jwt");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const queries = require("../queries");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
  //   algorithms: ["RS256"], --> Can be used only when we have 64bit private keys
};

const verifyCallback = async (jwt_payload, done) => {
  try {
    const { email } = jwt_payload;
    const user = await queries.getUserByEmail(email);
    if (!user) {
      return done(null, false, "Please login again.");
    } else {
      return done(null, user);
    }
  } catch (err) {
    console.log(err);
    return done(err, false);
  }
};

const strategy = new JWTStrategy(options, verifyCallback);

passport.use(strategy);
