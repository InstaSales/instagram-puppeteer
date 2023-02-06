export interface IPage {
  canBeAccessed(): Promise<boolean>;
  open(): Promise<void>;
}
