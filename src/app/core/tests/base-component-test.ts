import { TestBed } from '@angular/core/testing';
import { TestBase } from './base-test';

export class BaseComponentTest<T> extends TestBase<T> {
  constructor() {
    // Here we can override any of the modules imported by default into the test bed setup
    super();
  }
  overrideModules(testBed: TestBed): TestBed {
    // Return the modified testBed if needed
    return testBed;
  }
}
