const { chromium } = require('playwright');

async function main(noticeNumber, taxPayerID) {
  const browser = await chromium.connect({
    wsEndpoint: 'wss://yourrr-railway-appp.up.railway.app/playwright?token=YOUR_TOKEN',
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://mytax.dc.gov/_/');

  const element = page.locator('text=Validate a Certificate of');
  await element.scrollIntoViewIfNeeded();
  await page.click('text=Validate a Certificate of');

  await page.fill("//input[contains(@name, 'Dc-8')]", noticeNumber);
  await page.fill("//input[contains(@name, 'Dc-a')]", taxPayerID);
  await page.click("//button[contains(@data-name, 'Dc-c')]");

  await page.waitForTimeout(1000);
  const nonCompliance = await page.textContent('#caption2_Dc-k');
  await page.waitForTimeout(1000);
  const certificateNotFound = await page.textContent('#caption2_Dc-g');
  await page.waitForTimeout(1000);
  const issueDate = await page.textContent('#caption2_Dc-h');
  await page.waitForTimeout(1000);
  const date = await page.getAttribute('#Dc-h', 'value');
  await page.waitForTimeout(1000);
  const issuedTo = await page.textContent('#caption2_Dc-i');
  await page.waitForTimeout(1000);
  const issuedToName = await page.getAttribute('#Dc-i', 'value');
  await page.waitForTimeout(1000);
  const caption2 = await page.textContent('#caption2_Dc-j');
  await page.waitForTimeout(1000);
  const caption2Element = await page.locator('//span[@id="caption2_Dc-l" and contains(@class, "CTE") and contains(@class, "CaptionLinkText") and text()="Click here to request a current Certificate of Clean Hands for this taxpayer."]');
  await page.waitForTimeout(1000);
  const caption2Visible = await caption2Element.isVisible();
  if (!date) {
    console.log(certificateNotFound);
  } else if (!caption2Visible) {
    console.log(issueDate, date, issuedTo, issuedToName, nonCompliance);
  } else {
    console.log(issueDate, date, issuedTo, issuedToName, caption2);
  }  

  await browser.close();
}

const noticeNumber = process.argv[2];
const taxPayerID = process.argv[3];

main(noticeNumber, taxPayerID);
