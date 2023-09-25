require("dotenv").config();
const { Aes256Cbc, generateKey, generateIV } = require("aes256cbc-enc");
const express = require("express");
const Axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const ENCRYPT = Boolean(Number(process.env.ENCRYPT || "0"));
const ENABLE_PLAYGROUND = Boolean(Number(process.env.ENABLE_PLAYGROUND || "0"));
const ENCRYPT_KEY = process.env.ENCRYPT_KEY || generateKey();
const TOKEN = process.env.TOKEN;

const enc = new Aes256Cbc({
  key: ENCRYPT_KEY,
});

app.use(require("cors")());
app.use(express.json({ limit: "50mb" }));

if (TOKEN) {
  app.use((req, res, next) => {
    const reqToken = req.headers?.["u-token"];
    if (reqToken !== TOKEN) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      next();
    }
  });
}

app.all("/", async (req, res, next) => {
  try {
    // handle decryption
    let _decryptedBody;
    if (
      ENCRYPT &&
      ["POST", "PUT"].includes(req.method) &&
      req.headers["content-type"] === "application/json"
    ) {
      if (Object.keys(req.body || {}.length > 0) && req.body.data) {
        _decryptedBody = enc.decrypt(req.body.data);
      } else {
        throw new Error("encrypted data is required");
      }
    }

    // handle validation
    const tUrl = req.query?.url || "";
    if (!tUrl) throw new Error("Need URL");
    const targetUrl = new URL(tUrl);
    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      throw new Error("Invalid Protocol");
    }

    // handle request
    const data = ["POST", "PUT"].includes(req.method)
      ? _decryptedBody || req.body
      : undefined;
    delete req.headers["content-length"];
    const axiosOpts = {
      url: tUrl,
      method: req.method,
      headers: {
        ...req.headers,
        host: targetUrl.host,
      },
      ...(data ? { data } : {}),
    };
    const resp = await Axios.request(axiosOpts);

    // handle encryption
    if (ENCRYPT) {
      const encData = enc.encrypt(JSON.stringify(resp.data || {}));
      res.json({ data: encData });
    } else {
      res.status(resp.status).json(resp.data);
    }
  } catch (error) {
    const errMsg = error?.response?.data || error?.message;
    res.status(400).json({ message: errMsg });
  }
});

if (ENABLE_PLAYGROUND) {
  app.post("/encrypt", async (req, res) => {
    try {
      const encrypted = enc.encrypt(JSON.stringify(req.body.data));
      res.json({ data: encrypted });
    } catch (error) {
      res.status(400).json({ message: error?.message });
    }
  });

  app.post("/decrypt", async (req, res) => {
    try {
      const decrypted = enc.decrypt(req.body.data);
      try {
        const json = JSON.parse(decrypted);
        res.json({ data: json, type: "json" });
      } catch (error) {
        res.json({ data: decrypted, type: "text" });
      }
    } catch (error) {
      res.status(400).json({ message: error?.message });
    }
  });
}

app.listen(PORT, () => {
  console.log(`proxy server running on http://localhost:${PORT}`);
  if (ENCRYPT) {
    console.table({
      ENCRYPT_KEY,
      ENCRYPT_IV,
    });
  }
});
