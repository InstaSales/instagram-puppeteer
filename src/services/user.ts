import { Page } from "puppeteer-core";
import { Logger } from "tslog";
import { UserProfileInterceptor } from "./interceptors/user-profile";
import { getUserURL } from "../core";

const logger = new Logger({ name: "UserService" });

export type UserServiceOptions = {
  page: Page;
};

export class UserService {
  private readonly profileInterceptor = new UserProfileInterceptor();
  private readonly page: Page;

  constructor(options: UserServiceOptions) {
    this.page = options.page;
  }

  async profile(username: string) {
    const [profileResponse] = await Promise.allSettled([
      this.page.waitForResponse(this.profileInterceptor.webProfileInfo),
      this.page.goto(getUserURL(username)),
    ]);

    logger.info(profileResponse);

    return {
      profile:
        profileResponse.status === "fulfilled"
          ? ((await profileResponse.value.json()) as object)
          : undefined,
    };
  }
}
