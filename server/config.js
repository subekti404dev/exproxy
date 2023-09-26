const { existsSync, writeFileSync } = require("fs");
const path = require("path");
const configFilePath = path.join(__dirname, "config.json");
const { generateKey } = require("aes256cbc-enc");

class Config {
  _config = {
    enable_encrypt: true,
    enable_playground: false,
    encrypt_key: null,
    static_token: null,
  };

  constructor() {
    if (existsSync(configFilePath)) {
      this._config = require(configFilePath);
    } else {
      this._config.encrypt_key = generateKey();
      this._writeCurrentConfig();
    }
  }

  _writeCurrentConfig() {
    writeFileSync(configFilePath, JSON.stringify(this._config, null, 2));
  }

  get isEnableEncrypt() {
    return this._config.enable_encrypt;
  }

  enableEncrypt(value) {
    this._config = { ...this._config, enable_encrypt: value };
    this._writeCurrentConfig();
  }

  get isEnablePlayground() {
    return this._config.enable_playground;
  }

  enablePlayground(value) {
    this._config = { ...this._config, enable_playground: value };
    this._writeCurrentConfig();
  }

  get encryptKey() {
    return this._config.encrypt_key;
  }

  setEncryptKey(value) {
    this._config = { ...this._config, encrypt_key: value };
    this._writeCurrentConfig();
  }

  get staticToken() {
    return this._config.static_token;
  }

  setStaticToken(value) {
    this._config = { ...this._config, static_token: value };
    this._writeCurrentConfig();
  }
}

export const config = new Config();
