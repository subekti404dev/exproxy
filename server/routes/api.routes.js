require("dotenv").config();
const sha256 = require("js-sha256");
const express = require("express");
const router = express.Router();
const {
  config,
  username: _username,
  password: _password,
} = require("../config");
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

router.get("/masking", (req, res) => {
  res.json({ success: true, data: config.config.domains });
});

router.post("/masking", (req, res) => {
  try {
    const { mask_id, domain } = req.body || {};
    if (!mask_id || !domain) throw new Error("mask_id and domain are required");
    config.addDomain({ mask_id, domain });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/masking/:mask_id", (req, res) => {
  try {
    const { domain } = req.body || {};
    const mask_id = req.params.mask_id;
    if (!mask_id || !domain) throw new Error("mask_id and domain are required");
    config.updateDomain({ mask_id, domain });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/masking/:mask_id", (req, res) => {
  try {
    const mask_id = req.params.mask_id;
    if (!mask_id) throw new Error("mask_id is required");
    config.deleteDomain({ mask_id });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
