import { InstagramBrowser } from "./browser";
import { AuthService } from "../services";

type InstagramPuppeteerClientOptions = {
  username: string;
  password: string;
};

export class InstagramPuppeteerClient {
  public auth: AuthService;

  private readonly options: InstagramPuppeteerClientOptions;

  constructor(options: InstagramPuppeteerClientOptions) {
    this.options = options;

    this.auth = new AuthService({
      ...this.options,
    });
  }

  public close() {
    return InstagramBrowser.getInstance().then(
      (browser) => browser.close() as Promise<void>
    );
  }
}
