require("dotenv").config();
const express = require("express");
const passport = require("passport");
const queries = require("./queries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(passport.initialize());
require("./config/passport");
// For sending Post request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

app.post("/login", async (req, res, next) => {
  try {
    const user = await queries.getUserByEmail(req.body.email);

    if (!user) {
      return res.status(404).send("No user found.");
    }

    // Validate Password
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).send("Invalid Credentials");
    }

    const payload = {
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    // o use RS256 we need to have a 64 bit private key in .pem file
    // const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    return res.status(200).send({
      success: true,
      msg: "Login Successful",
      token: `Bearer ${token}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

// Protected Route
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).send({ email: req.user.email });
  }
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));
