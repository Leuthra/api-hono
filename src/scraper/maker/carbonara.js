import { playwright } from "../../function/playwright.js";

async function carbonara(text) {
const code = `const { chromium } = require('playwright');

async function carbonara(text) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(\`https://carbon.now.sh/?code=${encodeURIComponent(text)}\`);
  await page.waitForSelector(".container-bg");
  const container = await page.$(".container-bg");
  const buffer = await container.screenshot();
  const base64 = buffer.toString("base64");

  await browser.close();
  return base64;
}

carbonara('${text}').then(a => console.log(a));`;

  const { output } = await playwright(code.trim());
  return output;
}

export { carbonara };
