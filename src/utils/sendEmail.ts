import axios from "axios";

export function sendEmail() {
  const apiEndpoint = "/api/email";

  axios.post(apiEndpoint);
}
