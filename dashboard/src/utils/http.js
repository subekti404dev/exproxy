import Axios from "axios";

const http = (hash) =>
  Axios.create({
    baseURL: "http://localhost:3000/_api",
    headers: {
      hash,
    },
  });

export default http;
