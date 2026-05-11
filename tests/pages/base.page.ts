import { Page } from '@playwright/test';
import { NavigationBar } from '../common/component/navigation-bar';

export class BasePage {
  readonly page: Page;
  readonly navigationBar: NavigationBar;

  constructor(page: Page) {
    this.page = page;
    this.navigationBar = new NavigationBar(page);
  }
}
