import { readFile, stat, writeFile } from "fs/promises";
import { Browser, Page } from "puppeteer-core";
import { Logger } from "tslog";
import { BrowserUserAgent, InstagramBaseURL, Language } from "../constants";
import {
  AuthService,
  LanguageService,
  UserService,
  CookiesService,
} from "../services";

const logger = new Logger({ name: "Client" });

type InstagramPuppeteerClientOptions = {
  browser: Browser;
  userAgent?: string;
};

export class InstagramPuppeteerClient {
  browser: Browser;
  page?: Page;

  public auth?: AuthService;
  public user?: UserService;

  constructor(private readonly options: InstagramPuppeteerClientOptions) {
    this.browser = options.browser;
    this.options = options;
  }

  async init() {
    logger.info("Initializing Instagram Puppeteer Client");
    this.page = await this.browser.newPage();
    await this.page.setUserAgent(
      this.options.userAgent?.toString() ?? BrowserUserAgent
    );
    await this.page.setExtraHTTPHeaders({ "Accept-Language": Language.short });
    await this.page.goto(InstagramBaseURL, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
    });

    await stat("cookies.json")
      .then(() => logger.info("cookies.json file found"))
      .then(() => readFile("cookies.json"))
      .then((data) => {
        const cookies = JSON.parse(data.toString());
        return this.page?.setCookie(...cookies);
      })
      .catch(() => logger.warn("No cookies.json file found"));

    const languageService = new LanguageService({ page: this.page });
    logger.info(`Changing language to ${Language.long}...`);
    await languageService.changeLanguage(Language.short);

    const cookiesService = new CookiesService({ page: this.page });
    await cookiesService.allowCookies();

    this.auth = new AuthService({ page: this.page });
    this.user = new UserService({ page: this.page });
  }

  async close() {
    logger.info("Closing Instagram Puppeteer Client");
    await this.page
      ?.cookies()
      .then((cookies) => writeFile("cookies.json", JSON.stringify(cookies)));
    await this.page?.close();
  }
}
