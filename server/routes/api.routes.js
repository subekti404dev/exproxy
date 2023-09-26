require("dotenv").config();
const express = require("express");
const router = express.Router();
const _username = process.env.USERNAME || "admin";
const _password = process.env.PASSWORD || "admin";

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      throw new Error(`'username' and 'password' are required!`);
    }
    // console.log({ _username, _password });
    if (username === _username && password === _password) {
      res.json({ success: true });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
