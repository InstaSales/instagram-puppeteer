import { InstagramBrowser, InstagramPuppeteerClient } from "../src";
import { BrowserUserAgent } from "../src/constants";

describe("InstagramPuppeteerClient", () => {
  let browser: InstagramBrowser;
  beforeAll(() => InstagramBrowser.getInstance().then((b) => (browser = b)));
  afterAll(() => browser.close());

  test("InstagramPuppeteerClient initialization", async () => {
    new InstagramPuppeteerClient({
      username: "username",
      password: "password",
    });
  });

  test("UserAgent initialization", async () => {
    expect(BrowserUserAgent).toBeTruthy();
  });

  test("InstagramPuppeteerClient login", async () => {
    const client = new InstagramPuppeteerClient({
      username: "123",
      password: "123",
    });

    await client.auth.login();
  });
});
