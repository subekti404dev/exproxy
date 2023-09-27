export const isJSONString = (str) => {
  try {
    JSON.parse(str);
    if (
      (str.startsWith(`{`) && str.endsWith(`}`)) ||
      (str.startsWith(`[`) && str.endsWith(`]`))
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
