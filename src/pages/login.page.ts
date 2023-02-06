import { Logger } from "tslog";
import { LanguageExtension } from "./language.extension";
import { IPage } from "./page";
import { InstagramBaseURL } from "../constants";
import { InstagramBrowser } from "../core";
import { sleep } from "../core/utils";

const logger: Logger<string> = new Logger({ name: "LoginPage" });

export type LoginPageOptions = {
  readonly language: { short: string; long: string };
};

export class LoginPage extends LanguageExtension implements IPage {
  private readonly url = `${InstagramBaseURL}/?hl=en`;
  private readonly options: LoginPageOptions;

  constructor(options: LoginPageOptions) {
    super();
    this.options = options;
  }

  public canBeAccessed(): Promise<boolean> {
    return InstagramBrowser.getInstance()
      .then((browser) =>
        Promise.resolve(
          logger.info("Checking if login page can be accessed")
        ).then(() => browser)
      )
      .then((browser) => browser.goto(this.url))
      .then((browser) => sleep(browser, 500))
      .then((browser) => this.setLanguage().then(() => browser))
      .then((browser) => browser.find("//button[.//text() = 'Log in']"));
  }

  public async open(): Promise<void> {
    logger.info("Opening login page");
  }

  public setLanguage(): Promise<LoginPage> {
    return this.getCurrentLanguage().then((langCode) => {
      if (langCode !== this.options.language.short) {
        logger.info(`Changing language to ${this.options.language.long}...`);
        return this.changeLanguage(this.options.language.short).then(() =>
          Promise.resolve(this)
        );
      }
      return Promise.resolve(this);
    });
  }

  public fillCredentials(
    username: string,
    password: string
  ): Promise<LoginPage> {
    return InstagramBrowser.getInstance()
      .then((browser) =>
        browser.page
          .type('input[name="username"]', username, {
            delay: 50,
          })
          .then(() => browser)
      )
      .then((browser) => sleep(browser, 1000))
      .then((browser) =>
        browser.page
          .type('input[name="password"]', password, {
            delay: 50,
          })
          .then(() => browser)
      )
      .then((browser) => sleep(browser, 1000))
      .then(() => Promise.resolve(this));
  }

  public async clickLogin(): Promise<LoginPage> {
    return InstagramBrowser.getInstance()
      .then((browser) =>
        browser.click("//button[.//text() = 'Log in']").then(() => browser)
      )
      .then((browser) => sleep(browser, 1000))
      .then(() => Promise.resolve(this));
  }
}
