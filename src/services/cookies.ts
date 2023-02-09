import { ElementHandle, Page } from "puppeteer-core";
import { Logger } from "tslog";

const logger = new Logger({ name: "CookiesService" });

export type CookiesServiceOptions = {
  page: Page;
};

export type SharedDataResponse = {
  message: string;
  checkpoint_url?: string;
  lock: boolean;
  flow_render_type: number;
  status: "ok" | "fail";
};

export class CookiesService {
  private readonly page: Page;

  constructor(options: CookiesServiceOptions) {
    this.page = options.page;
  }

  async allowCookies() {
    logger.info("Allowing cookies...");

    const cookiesButtons = await Promise.allSettled([
      this.page
        .$x('//button[contains(text(), "Accept")]')
        .then((buttons) => buttons.shift()),
      this.page
        .$x(
          '//button[contains(text(), "Allow essential and optional cookies")]'
        )
        .then((buttons) => buttons.shift()),
    ]).then((buttons) =>
      buttons
        .filter((button) => button.status === "fulfilled")
        .map(
          (button) =>
            (button as PromiseFulfilledResult<ElementHandle<Node> | undefined>)
              .value
        )
        .filter((button) => button !== undefined)
        .map((button) => button as ElementHandle)
    );

    if (cookiesButtons.length === 0) {
      logger.info("No cookies buttons found");
      return;
    }

    await Promise.all([
      this.page
        .waitForResponse((response) => {
          return (
            response.request().url().includes("shared_data") &&
            response.request().method() === "GET"
          );
        })
        .then((response) => response.json())
        .then((data: SharedDataResponse) =>
          data.status === "fail"
            ? Promise.reject("Cannot allow cookies: " + data.message)
            : Promise.resolve()
        ),
      ...cookiesButtons.map((button) => button.click()),
    ]).then(() => new Promise((resolve) => setTimeout(resolve, 1000)));
  }
}
