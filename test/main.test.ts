import chromium from "@sparticuz/chromium";
import { Browser, launch } from "puppeteer-core";
import { InstagramPuppeteerClient } from "../src";
import { BrowserUserAgent } from "../src/constants";

describe("InstagramPuppeteerClient", () => {
  let browser: Browser;
  let client: InstagramPuppeteerClient;

  beforeAll(async () => {
    browser = await launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    client = new InstagramPuppeteerClient({ browser });

    await client.init();
  });

  afterAll(async () => {
    await client.close();
    await browser.close();
  });

  test("InstagramPuppeteerClient initialization", async () => {
    expect(client).toBeTruthy();
  });

  test("UserAgent initialization", async () => {
    expect(BrowserUserAgent).toBeTruthy();
  });

  test("InstagramPuppeteerClient login", async () => {
    expect(client.auth).toBeTruthy();
    await expect(client.auth?.login("123123", "123123")).rejects.toThrow(
      "Login error: couldn't login"
    );
  });
});
