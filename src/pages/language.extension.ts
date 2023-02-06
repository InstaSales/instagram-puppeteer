import { ElementHandle } from "puppeteer-core";
import { InstagramBrowser } from "../core";

export class LanguageExtension {
  protected changeLanguage(lang: string): Promise<void> {
    return this.getLanguageField()
      .then((element) =>
        element.evaluate((el, langCode) => {
          const option = el.querySelector(
            `option[value='${langCode}']`
          ) as HTMLOptionElement;
          option.selected = true;
          el.dispatchEvent(new Event("change", { bubbles: true }));
          return el;
        }, lang)
      )
      .then(() => InstagramBrowser.getInstance())
      .then((browser) => browser.page.waitForSelector("button[type='submit']"))
      .then(() => Promise.resolve());
  }

  getCurrentLanguage(): Promise<string> {
    return this.getLanguageField().then((element) =>
      element.evaluate((el) => el.value)
    );
  }

  protected getLanguageField(): Promise<ElementHandle<HTMLSelectElement>> {
    return InstagramBrowser.getInstance()
      .then(
        (browser) =>
          browser.page.$x(`//select`) as Promise<
            ElementHandle<HTMLSelectElement>[]
          >
      )
      .then(
        (elements) =>
          elements.shift() ||
          Promise.reject("Language field not found at current page")
      );
  }
}
