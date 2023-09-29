export const decryptRequestBody = ({ req, isEnableEncrypt, getEnc }) => {
  let _decryptedBody;
  if (
    isEnableEncrypt &&
    ["POST", "PUT"].includes(req.method) &&
    req.headers["content-type"] === "application/json"
  ) {
    if (Object.keys(req.body || {}).length > 0 && req.body.data) {
      _decryptedBody = getEnc().decrypt(req.body.data);
    } else {
      throw new Error("encrypted data is required");
    }
  }
  return _decryptedBody;
};

export const encryptResponseBody = ({
  res,
  data,
  status,
  isEnableEncrypt,
  getEnc,
}) => {
  if (isEnableEncrypt) {
    const encData = getEnc().encrypt(JSON.stringify(data || {}));
    res.json({ data: encData });
  } else {
    res.status(status).json(data);
    return;
  }
};
