import { HTTPResponse } from "puppeteer-core";

export class UserProfileInterceptor {
  webProfileInfo(response: HTTPResponse) {
    return (
      response.status() === 200 &&
      response.request().method() === "GET" &&
      response
        .request()
        .url()
        .match(/web_profile_info/) != null
    );
  }
}
