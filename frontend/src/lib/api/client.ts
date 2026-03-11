import axios from "axios";

const apiClient = axios.create({
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

export default apiClient;
