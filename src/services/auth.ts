import { Logger } from "tslog";
import { InstagramBrowser } from "../core";
import { InstagramState } from "../core/state";
import { sleep } from "../core/utils";
import { LoginPage } from "../pages";

const logger: Logger<string> = new Logger({ name: "AuthService" });

export type AuthServiceOptions = {
  username: string;
  password: string;
};

export class AuthService {
  private readonly options: AuthServiceOptions;

  constructor(options: AuthServiceOptions) {
    this.options = options;
  }

  public async login() {
    return InstagramState.getInstance()
      .setCurrentPage(
        new LoginPage({
          language: {
            short: "en",
            long: "English",
          },
        })
      )
      .then((page) =>
        page.fillCredentials(this.options.username, this.options.password)
      )
      .then((page) => page.clickLogin())
      .then(() => InstagramBrowser.getInstance())
      .then((browser) => sleep(browser, 5000))
      .then((browser) =>
        browser.saveScreenshot("./screenshot-after-login.png")
      );
  }

  public async login2() {
    return InstagramBrowser.getInstance()
      .then((browser) => sleep(browser, 3000))
      .then((browser) => this.clickAllowCookies(browser))
      .then((browser) =>
        browser.saveScreenshot("./screenshot-after-cookies.png")
      )

      .then((browser) =>
        this.click(browser, '//button[contains(text(), "Log In")]')
      )

      .then((browser) =>
        browser.page
          .type('input[name="username"]', this.options.username, {
            delay: 50,
          })
          .then(() => browser)
      )
      .then((browser) => sleep(browser, 1000))
      .then((browser) =>
        browser.saveScreenshot("./screenshot-after-username.png")
      )

      .then((browser) =>
        browser.page
          .type('input[name="password"]', this.options.password, {
            delay: 50,
          })
          .then(() => browser)
      )
      .then((browser) => sleep(browser, 1000))
      .then((browser) =>
        browser.saveScreenshot("./screenshot-after-password.png")
      )

      .then((browser) => this.clickLogin(browser))
      .then((browser) => sleep(browser, 5000))
      .then((browser) =>
        browser.saveScreenshot("./screenshot-after-login.png")
      );
  }

  private clickAllowCookies(instagramBrowser: InstagramBrowser) {
    return this.click(instagramBrowser, '//button[contains(text(), "Accept")]')
      .then((browser) =>
        this.click(
          browser,
          '//button[contains(text(), "Only allow essential cookies")]'
        )
      )
      .then((browser) =>
        this.click(
          browser,
          '//button[contains(text(), "Allow essential and optional cookies")]'
        )
      );
  }

  private click(instagramBrowser: InstagramBrowser, query: string) {
    return instagramBrowser
      .click(query)
      .then((browser) =>
        browser
          ? browser
          : (() => {
              logger.warn(`Element ${query} not found`);
              return InstagramBrowser.getInstance();
            })()
      )
      .then((browser) => sleep(browser, 1000));
  }

  private clickLogin(instagramBrowser: InstagramBrowser) {
    return this.click(instagramBrowser, "//button[.//text() = 'Log In']").then(
      (browser) => this.click(browser, "//button[.//text() = 'Log in']")
    );
  }

  public async logout() {}
}
