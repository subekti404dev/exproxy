export const isValidHexadecimal = (input) => {
  const hexPattern = /^[0-9a-fA-F]{64}$/;
  return hexPattern.test(input);
};

export const validateHex = (_, value) => {
  if (!isValidHexadecimal(value)) {
    return Promise.reject("Invalid hexadecimal string");
  }
  return Promise.resolve();
};
