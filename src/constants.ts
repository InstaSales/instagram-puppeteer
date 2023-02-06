import chromium from "@sparticuz/chromium";
import UserAgent from "user-agents";

export const InstagramBaseURL = "https://www.instagram.com";
export const BrowserUserAgent = new UserAgent([
  /Chrome/,
  {
    deviceCategory: "desktop",
    platform: "Linux x86_64",
    viewportWidth: chromium.defaultViewport.width,
    viewportHeight: chromium.defaultViewport.height,
  },
]).toString();
