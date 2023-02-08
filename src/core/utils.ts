import { ElementHandle, Page } from "puppeteer-core";
import { InstagramBaseURL } from "../constants";

export const sleep = <T>(ctx: T, ms: number, deviation: number = 1) =>
  new Promise<T>((resolve) =>
    setTimeout(() => resolve(ctx), (Math.random() * deviation + 1) * ms)
  );

export const getUserURL = (username: string) =>
  `${InstagramBaseURL}/${encodeURIComponent(username.toLowerCase())}`;

export const goto = async (page: Page, url: string) => {
  if (page.url() === url || page.url() === url + "/?hl=en") {
    return;
  }
};

export const click = async (page: Page, query: string) => {
  return page
    .$x(query)
    .then((elements) => (elements as ElementHandle[]).shift()?.click());
};
