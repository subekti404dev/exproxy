import Axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "/_api"
    : "http://localhost:3000/_api";
const http = (hash) =>
  Axios.create({
    baseURL,
    headers: {
      hash,
    },
  });

export default http;
