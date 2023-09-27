require("dotenv").config();
const sha256 = require("js-sha256");
const express = require("express");
const router = express.Router();
const { config } = require("../config");
const _username = process.env.USERNAME || "admin";
const _password = process.env.PASSWORD || "admin";
const loginHash = sha256(`${_username}:${_password}`);

const checkLoginHash = (req) => {
  if (req.headers.hash !== loginHash) throw new Error("Unauthorized");
};

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      throw new Error(`'username' and 'password' are required!`);
    }
    // console.log({ _username, _password });
    if (username === _username && password === _password) {
      res.json({ success: true, hash: loginHash });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/config", (req, res) => {
  try {
    checkLoginHash(req);
    res.json({ success: true, data: config.config });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/config", (req, res) => {
  try {
    checkLoginHash(req);
    config.setConfig(req.body);
    res.json({ success: true, data: config.config });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
