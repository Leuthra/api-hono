import { playwright } from "../../function/playwright.js";

async function bratgenerator(text) {
const code = `const { chromium } = require('playwright');

async function generateBratImage(text) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
    });
    const page = await context.newPage();
    await page.goto('https://www.bratgenerator.com');

    // Setup theme and fill text input
    await page.evaluate(() => setupTheme('white'));
    // Ensure proper handling of multiline text
    await page.fill('#textInput', text);

    // Accept cookies if the button is present
    const acceptButton = await page.$('#onetrust-accept-btn-handler');
    if (acceptButton) {
        await acceptButton.click();
    }

    await page.waitForTimeout(500); // Wait for rendering

    // Get the specific element and take its screenshot
    const element = await page.$('#textOverlay');
    if (element) {
        const screenshot = await element.screenshot({ type: 'png' });
        await browser.close();
        return screenshot.toString('base64');
    } else {
        console.error("Element with ID 'textOverlay' not found.");
        await browser.close();
        return null;
    }
}

generateBratImage('${text}').then(a => console.log(a));`;

  const { output } = await playwright(code.trim());
  return output;
}

export { bratgenerator };
