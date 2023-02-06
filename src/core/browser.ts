import { writeFile, stat, readFile } from "fs/promises";
import chromium from "@sparticuz/chromium";
import { Browser, ElementHandle, launch, Page } from "puppeteer-core";
import { Logger } from "tslog";
import { BrowserUserAgent } from "../constants";

const logger: Logger<any> = new Logger({ name: "InstagramBrowser" });

export class InstagramBrowser {
  public static async getInstance(): Promise<InstagramBrowser> {
    if (!this.instance) {
      this.instance = new InstagramBrowser();
      await this.instance.init();
      logger.info("InstagramBrowser instance initialized");
    }
    return this.instance;
  }

  private static instance: InstagramBrowser;
  private _browser: Browser | undefined;
  private _page: Page | undefined;

  private constructor() {}

  public async init(): Promise<void> {
    this._browser = await launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    this._page = await this.browser
      .newPage()
      .then((page) => page.setUserAgent(BrowserUserAgent).then(() => page))
      .then((page) =>
        page.setExtraHTTPHeaders({ "Accept-Language": "en" }).then(() => page)
      );

    await stat("cookies.json")
      .then(() => logger.info("cookies.json file found"))
      .then(() => readFile("cookies.json"))
      .then((data) => {
        const cookies = JSON.parse(data.toString());
        return this.page.setCookie(...cookies);
      })
      .catch(() => logger.warn("No cookies.json file found"));
  }

  private get browser(): Browser {
    if (!this._browser) {
      throw new Error("Browser is not initialized");
    }
    return this._browser;
  }

  public get page(): Page {
    if (!this._page) {
      throw new Error("Page is not initialized");
    }
    return this._page;
  }

  public goto(url: string): Promise<InstagramBrowser> {
    return this.page
      .goto(url, { waitUntil: ["load", "domcontentloaded", "networkidle0"] })
      .then(() => this);
  }

  public find(query: string): Promise<boolean> {
    return this.page.$x(query).then((elements) => elements.length > 0);
  }

  public click(query: string): Promise<InstagramBrowser | null> {
    return this.page
      .$x(query)
      .then((elements) =>
        (elements as ElementHandle[])
          .shift()
          ?.click()
          .then(() => true)
      )
      .then((clicked) => (clicked ? this : null));
  }

  public clickButtonContains(text: string): Promise<InstagramBrowser> {
    return this.page
      .click(`//button[contains(text(), "${text}")]`)
      .then(() => this);
  }

  public clickButtonExact(text: string): Promise<InstagramBrowser> {
    return this.page.click(`//button[.//text() = '${text}']`).then(() => this);
  }

  public saveScreenshot(path: string): Promise<InstagramBrowser> {
    return this.page
      .screenshot()
      .then((buffer) => writeFile(path, buffer))
      .then(() => this);
  }

  public close(): Promise<void> {
    if (!this._browser) return Promise.resolve();
    if (!this._page) return Promise.resolve();

    return this.page
      .cookies()
      .then((cookies) =>
        writeFile("cookies.json", JSON.stringify(cookies, null, 2))
      )
      .then(() => this.browser.close());
  }
}
