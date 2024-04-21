const { chromium } = require('playwright');

async function main(noticeNumber, taxPayerID) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://mytax.dc.gov/_/');

  const element = page.locator('text=Validate a Certificate of');
  await element.scrollIntoViewIfNeeded();
  await page.click('text=Validate a Certificate of');

  await page.fill("//input[contains(@name, 'Dc-8')]", noticeNumber);
  await page.fill("//input[contains(@name, 'Dc-a')]", taxPayerID);
  await page.click("//button[contains(@data-name, 'Dc-c')]");

  await page.waitForTimeout(2000);

  const nonCompliance = await page.textContent('#caption2_Dc-k');
  const certificateNotFound = await page.textContent('#caption2_Dc-g');
  const issueDate = await page.textContent('#caption2_Dc-h');
  const date = await page.getAttribute('#Dc-h', 'value');
  const issuedTo = await page.textContent('#caption2_Dc-i');
  const issuedToName = await page.getAttribute('#Dc-i', 'value');
  const caption2 = await page.textContent('#caption2_Dc-j');
  const caption2Element = await page.locator('//span[@id="caption2_Dc-l" and contains(@class, "CTE") and contains(@class, "CaptionLinkText") and text()="Click here to request a current Certificate of Clean Hands for this taxpayer."]');
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
