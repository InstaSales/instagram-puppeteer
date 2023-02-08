import { ElementHandle, Page } from "puppeteer-core";
import { Logger } from "tslog";

const logger = new Logger({ name: "LanguageService" });

export interface LanguageServiceOptions {
  page: Page;
}

export class LanguageService {
  page: Page;

  constructor(options: LanguageServiceOptions) {
    this.page = options.page;
  }

  async changeLanguage(lang: string): Promise<void> {
    const languageSelector: ElementHandle<HTMLSelectElement> | null =
      await this.page.waitForSelector("select");
    if (!languageSelector) {
      throw new Error("Language selector not found at current page");
    }

    const currentLang = await languageSelector.evaluate((el) => el.value);
    if (currentLang === lang) {
      logger.info(`Language already set to ${lang}`);
      return;
    }
    logger.info(`Current language is ${currentLang}, changing to ${lang}...`);

    await Promise.all([
      this.page.waitForNavigation(),
      languageSelector.select(lang),
    ]);
  }
}
