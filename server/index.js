import { decryptRequestBody, encryptResponseBody } from "./utils/enc.util";
import { isJSONString } from "./utils/json.util";

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

app.use("/_admin", express.static(path.join(process.cwd(), "_dashboard")));
app.use("/_api", require("./routes/api.routes"));

app.use((req, res, next) => {
  if (!config.staticToken) {
    next();
    return;
  }
  const reqToken = req.headers?.["u-token"];
  if (reqToken !== config.staticToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  } else {
    next();
  }
});

app.all("/", async (req, res) => {
  try {
    // handle decryption
    const _decryptedBody = decryptRequestBody({
      req,
      isEnableEncrypt: config.isEnableEncrypt,
      getEnc,
    });

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
        "accept-encoding": "*",
      },
      ...(data ? { data } : {}),
    };
    const resp = await Axios.request(axiosOpts);

    // handle encryption
    const isJson = (resp.headers?.["content-type"] || "")
      .toLowerCase()
      .includes("application/json");

    if (isJson) {
      encryptResponseBody({
        res,
        data: resp.data,
        status: resp.status,
        isEnableEncrypt: config.isEnableEncrypt,
        getEnc,
      });
    } else {
      const resp = await Axios.request({
        ...axiosOpts,
        responseType: "arraybuffer",
      });

      res.setHeader("Content-Type", resp.headers?.["content-type"]);
      res.send(resp.data);
    }
  } catch (error) {
    const errMsg = error?.response?.data || error?.message;
    res.status(400).json({ message: errMsg });
  }
});

app.all(["/m/:id", "/m/:id/*"], async (req, res) => {
  try {
    const id = req.params.id;
    const domain = config.getDomainByMaskId({ mask_id: id });
    if (!!domain) {
      const upath = req.params?.[0] || "";
      const udomain = domain;
      const uquery = Object.keys(req.query || {})
        .map((k) => `${k}=${req.query[k]}`)
        .join("&");

      const tUrl = path.join(udomain, upath, uquery ? `?${uquery}` : "");

      // handle decryption
      const _decryptedBody = decryptRequestBody({
        req,
        isEnableEncrypt: config.isEnableEncrypt,
        getEnc,
      });

      // handle validation
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
          "accept-encoding": "*",
        },
        ...(data ? { data } : {}),
      };
      const resp = await Axios.request(axiosOpts);

      // handle encryption
      const isJson = (resp.headers?.["content-type"] || "")
      .toLowerCase()
      .includes("application/json");

    if (isJson) {
      encryptResponseBody({
        res,
        data: resp.data,
        status: resp.status,
        isEnableEncrypt: config.isEnableEncrypt,
        getEnc,
      });
    } else {
      const resp = await Axios.request({
        ...axiosOpts,
        responseType: "arraybuffer",
      });

      res.setHeader("Content-Type", resp.headers?.["content-type"]);
      res.send(resp.data);
    }
    } else {
      throw new Error("Domain not found");
    }
  } catch (error) {
    const errMsg = error?.response?.data || error?.message;
    res.status(400).json({ message: errMsg });
  }
});

app.post("/encrypt", async (req, res) => {
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
    try {
      const isJSON = isJSONString(decrypted);
      if (!isJSON) throw new Error("not json");
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
