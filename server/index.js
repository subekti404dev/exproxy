require("dotenv").config();
const path = require("path");
const { Aes256Cbc } = require("aes256cbc-enc");
const express = require("express");
const Axios = require("axios");
const { config } = require("./config");

const app = express();
const PORT = 3000;

const enc = new Aes256Cbc({
  key: config.encryptKey,
});

app.use(require("cors")());
app.use(express.json({ limit: "50mb" }));

app.use("/_admin", express.static(path.join(__filename, "..", "_dashboard")));
app.use("/_api", require("./routes/api.routes"));

if (config.staticToken) {
  app.use((req, res, next) => {
    const reqToken = req.headers?.["u-token"];
    if (reqToken !== config.staticToken) {
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
      config.isEnableEncrypt &&
      ["POST", "PUT"].includes(req.method) &&
      req.headers["content-type"] === "application/json"
    ) {
      if (Object.keys(req.body || {}).length > 0 && req.body.data) {
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
    if (config.isEnableEncrypt) {
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

if (config.isEnablePlayground) {
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
  if (config.isEnableEncrypt) {
    console.table({
      encryptKey: config.encryptKey,
    });
  }
});
