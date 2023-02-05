// @ts-ignore
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

test("Check the page title of example.com", async () => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto("https://example.com");
  const pageTitle = await page.title();
  await browser.close();

  console.log(pageTitle);

  expect(pageTitle).toBe("Example Domain");
});
