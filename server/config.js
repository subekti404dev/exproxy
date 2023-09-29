require("dotenv").config();

const { existsSync, writeFileSync } = require("fs");
const path = require("path");
const configFilePath = path.resolve(process.cwd(), "config.json");
const { generateKey } = require("aes256cbc-enc");
class Config {
  _config = {
    enable_encrypt: true,
    enable_playground: false,
    encrypt_key: null,
    static_token: null,
    domains: [],
  };

  constructor() {
    if (existsSync(configFilePath)) {
      console.log("Config file exist: ", configFilePath);
      const file = Bun.file(configFilePath);
      file.json().then((json) => {
        this._config = { ...json, domains: json?.domains || [] };
        this._writeCurrentConfig();
      });
    } else {
      console.log("Create config file: ", configFilePath);
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

  get config() {
    return this._config;
  }

  setConfig(value) {
    this._config = { ...this._config, ...value };
    this._writeCurrentConfig();
  }

  addDomain({ mask_id, domain }) {
    const isExist = !!this._config.domains.find((d) => d.mask_id === mask_id);
    if (isExist) {
      throw new Error("mask_id already inused");
    } else {
      const domains = [...this._config.domains, { mask_id, domain }];
      this._config.domains = domains;
      this._writeCurrentConfig();
    }
  }

  updateDomain({ mask_id, domain }) {
    const isExist = this._config.domains.find((d) => d.mask_id === mask_id);
    if (!!isExist) {
      throw new Error("domain not found");
    } else {
      const domains = [
        ...this._config.domains.find((d) => d.mask_id !== mask_id),
        { mask_id, domain },
      ];
      this._config.domains = domains;
      this._writeCurrentConfig();
    }
  }

  deleteDomain({ mask_id }) {
    const isExist = this._config.domains.find((d) => d.mask_id === mask_id);
    if (!!isExist) {
      throw new Error("domain not found");
    } else {
      const domains = [
        ...this._config.domains.find((d) => d.mask_id !== mask_id),
      ];
      this._config.domains = domains;
      this._writeCurrentConfig();
    }
  }

  getDomainByMaskId({ mask_id }) {
    return this._config.domains.find((d) => d.mask_id === mask_id)?.domain;
  }
}

export const config = new Config();
export const username = process.env.USERNAME || "admin";
export const password = process.env.PASSWORD || "admin";
