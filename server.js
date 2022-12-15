require("dotenv").config();
const express = require("express");
const passport = require("passport");

const app = express();
require("./config/passport");
passport.initialize();

// For sending Post request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));
