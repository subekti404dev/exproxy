require("dotenv").config();
const path = require("path");
const { Aes256Cbc } = require("aes256cbc-enc");
const express = require("express");
const Axios = require("axios");
const { config, username, password } = require("./config");

const app = express();
const PORT = 3000;

const getEnc = () =>
  new Aes256Cbc({
    key: config.encryptKey,
  });

app.use(require("cors")());
app.use(express.json({ limit: "50mb" }));

console.log(path.resolve(process.cwd(), "_dashboard"));
app.use("/_admin", express.static(path.join(process.cwd(), "_dashboard")));
app.use("/_api", require("./routes/api.routes"));

app.use((req, res, next) => {
  // console.log('masuk pengecekan');
  if (!config.staticToken) {
    next();
    return;
  }
  const reqToken = req.headers?.["u-token"];
  if (reqToken !== config.staticToken) {
    console.log({ reqToken, configToken: config.staticToken });
    res.status(401).json({ message: "Unauthorized" });
    return;
  } else {
    next();
  }
});

app.all("/", async (req, res, next) => {
  try {
    console.log("masuk");
    // handle decryption
    let _decryptedBody;
    if (
      config.isEnableEncrypt &&
      ["POST", "PUT"].includes(req.method) &&
      req.headers["content-type"] === "application/json"
    ) {
      if (Object.keys(req.body || {}).length > 0 && req.body.data) {
        _decryptedBody = getEnc().decrypt(req.body.data);
        console.log({ _decryptedBody });
      } else {
        throw new Error("encrypted data is required");
      }
    }

    console.log("lewat");
    // handle validation
    const tUrl = req.query?.url || "";
    if (!tUrl) throw new Error("Need URL");
    console.log({ tUrl });
    const targetUrl = new URL(tUrl);
    console.log({ targetUrl });
    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      throw new Error("Invalid Protocol");
    }

    console.log("sebelum cek body");

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
    console.log("sebelum hit");
    const resp = await Axios.request(axiosOpts);
    // console.log({ resp });

    console.log("lewat hit", {
      "config.isEnableEncrypt": config.isEnableEncrypt,
    });

    // handle encryption
    if (config.isEnableEncrypt) {
      const encData = getEnc().encrypt(JSON.stringify(resp.data || {}));
      res.json({ data: encData });
    } else {
      console.log("masuk result");
      res.status(resp.status).json(resp.data);
      return;
    }
  } catch (error) {
    const errMsg = error?.response?.data || error?.message;
    res.status(400).json({ message: errMsg });
  }
});

app.post("/encrypt", async (req, res) => {
  console.log({ isEnablePlayground: config.isEnablePlayground });
  if (!config.isEnablePlayground) {
    res.status(401).json({ message: "Playground was disabled" });
  }
  try {
    const encrypted = getEnc().encrypt(JSON.stringify(req.body.data));
    res.json({ data: encrypted });
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
});

app.post("/decrypt", async (req, res) => {
  if (!config.isEnablePlayground) {
    res.status(401).json({ message: "Playground was disabled" });
  }
  try {
    const decrypted = getEnc().decrypt(req.body.data);
    console.log({ decrypted });
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

app.listen(PORT, () => {
  console.log(`proxy server running on http://localhost:${PORT}`);
  if (config.isEnableEncrypt) {
    console.table({
      username,
      password,
    });
  }
});
