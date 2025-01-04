import axios from "axios";

const playwright = async (code) => {
  try {
    const url = "https://try.playwright.tech/service/control/run";
    const headers = {
      authority: "try.playwright.tech",
      accept: "*/*",
      "content-type": "application/json",
      origin: "https://try.playwright.tech",
      referer: "https://try.playwright.tech/?l=playwright-test",
      "user-agent": "Postify/1.0.0",
    };
    const data = {
      code: code,
      language: "javascript",
    };
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error running playwright code:", error);
    throw error;
  }
};

export { playwright };