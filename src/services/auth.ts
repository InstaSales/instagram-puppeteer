import { ElementHandle, Page } from "puppeteer-core";
import { Logger } from "tslog";
import { InstagramBaseURL } from "../constants";
import { click, goto } from "../core";

const logger: Logger<string> = new Logger({ name: "AuthService" });

export type AuthServiceOptions = {
  page: Page;
};

export class AuthService {
  private readonly page: Page;

  constructor(options: AuthServiceOptions) {
    this.page = options.page;
  }

  async checkLogin(): Promise<boolean> {
    logger.info("Checking if user is logged in...");

    await goto(this.page, InstagramBaseURL);

    const loggedElements = await this.page.$x('//*[@aria-label="Home"]');
    if (loggedElements.length) {
      logger.info("User is logged in");
      return true;
    }

    logger.info("User is not logged in");
    return false;
  }

  async login(username: string, password: string): Promise<void> {
    logger.info("Logging in...");

    await goto(this.page, InstagramBaseURL);

    if (await this.checkLogin()) return;

    await this.page.type('input[name="username"]', username, {
      delay: 50,
    });

    await this.page.type('input[name="password"]', password, {
      delay: 50,
    });

    await Promise.all([
      Promise.race([
        this.page.waitForNavigation({ timeout: 7000 }),
        this.page
          .waitForSelector("#slfErrorAlert")
          .then((element) =>
            element?.evaluate((node) => node.textContent || "")
          )
          .then((errorAlertText) => {
            throw new Error("Login error: " + errorAlertText);
          }),
      ]),
      click(this.page, "//button[.//text() = 'Log in']"),
    ]);

    if (!(await this.checkLogin()))
      throw new Error("Login error: couldn't login");

    const buttons = [
      ...(await this.page.$x('//button[contains(text(), "Save Info")]')),
      ...(await this.page.$x('//button[contains(text(), "Save info")]')),
    ];
    if (buttons.length) {
      await Promise.all([
        this.page.waitForNavigation({ timeout: 7000 }),
        await Promise.allSettled(
          buttons.map((button) => (button as ElementHandle).click())
        ),
      ]);
    }

    await click(this.page, '//button[contains(text(), "Not Now")]');

    logger.info("Logged in");
  }
}
