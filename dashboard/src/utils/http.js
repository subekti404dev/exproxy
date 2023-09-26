import Axios from "axios";

const http = Axios.create({
  baseURL: "/_admin",
});

export default http;
