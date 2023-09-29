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

export const validateUrl = (rule, value, callback) => {
  if (value) {
    // Regular expression to check if the input is a valid URL
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(value)) {
      callback('Please enter a valid URL');
    }
  }
  callback();
};