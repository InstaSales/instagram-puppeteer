import { IPage } from "../pages";

export class InstagramState {
  public static getInstance(): InstagramState {
    if (!InstagramState.instance) {
      InstagramState.instance = new InstagramState();
    }

    return InstagramState.instance;
  }

  private static instance: InstagramState;

  private _isLogged: boolean = false;
  private _currentPage: IPage | null = null;
  private constructor() {}

  public get isLogged(): boolean {
    return this._isLogged;
  }

  public set isLogged(value: boolean) {
    this._isLogged = value;
  }

  public async setCurrentPage<T extends IPage>(page: T): Promise<T> {
    return page
      .canBeAccessed()
      .then((canBeAccessed) =>
        canBeAccessed ? page : Promise.reject("Page cannot be accessed")
      )
      .then(() => page.open())
      .then(() => (this._currentPage = page));
  }

  public get currentPage(): IPage {
    if (!this._currentPage) {
      throw new Error("Current page is not set");
    }
    return this._currentPage;
  }
}
