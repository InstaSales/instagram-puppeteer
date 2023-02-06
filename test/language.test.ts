import { InstagramBrowser } from "../src";
import { InstagramBaseURL } from "../src/constants";
import { LanguageExtension } from "../src/pages";

describe("LanguageExtension", () => {
  let browser: InstagramBrowser;
  beforeAll(() => InstagramBrowser.getInstance().then((b) => (browser = b)));
  afterAll(() => browser.close());

  it("check language detection", async () => {
    const expected = ["en", "de", "fr"];
    const urls = expected.map((lang) => `${InstagramBaseURL}/?hl=${lang}`);

    const english = await browser
      .goto(urls[0])
      .then(() => new LanguageExtension().getCurrentLanguage());

    expect(expected[0]).toEqual(english);

    const german = await browser
      .goto(urls[1])
      .then(() => new LanguageExtension().getCurrentLanguage());
    expect(expected[1]).toEqual(german);

    const french = await browser
      .goto(urls[2])
      .then(() => new LanguageExtension().getCurrentLanguage());
    expect(expected[2]).toEqual(french);
  });
});
