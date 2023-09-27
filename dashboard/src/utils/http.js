import Axios from "axios";

const lsHash = localStorage.getItem("hash");

const http = Axios.create({
  baseURL: "http://localhost:3000/_admin",
  headers: {
    ...(!!lsHash && { hash: lsHash }),
  },
});

export default http;
