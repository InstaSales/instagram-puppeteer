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
    logger.info("Logging in...");
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
      .then((browser) => sleep(browser, 5000));
  }
}
