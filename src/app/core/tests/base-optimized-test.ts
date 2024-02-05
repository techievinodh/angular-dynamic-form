import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BaseElementTest } from './base-element-test';

abstract class TestBase<T> {
  private fixture!: ComponentFixture<T>;
  private component!: T;

  constructor(
    private readonly coreModules: any[] = [],
    private readonly coreProviders: any[] = [],
    private readonly ukgProTestModules: any[] = []
  ) {}

  abstract overrideModules(testBed: TestBed): TestBed;

  async createTestBed(
    declarations: any[] = [],
    imports: any[] = [],
    providers: any[] = [],
    isShallow = true,
    isDestroyAfterEach = true
  ): Promise<void> {
    const configureTestModule = this.overrideModules(
      TestBed.resetTestingModule().configureTestingModule({
        imports: isShallow
          ? [...this.coreModules, ...imports]
          : [...this.coreModules, ...this.ukgProTestModules, ...imports],
        declarations: [...declarations],
        providers: isShallow
          ? [...providers]
          : [...this.coreProviders, ...providers],
        schemas: isShallow ? [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA] : [],
        teardown: { destroyAfterEach: isDestroyAfterEach } 
      })
    ).compileComponents();

    // Prevent angular from resetting testing module
    TestBed.resetTestingModule = () => TestBed;

    await configureTestModule;
  }

  // Other methods...

  async expectAllFormControlValues(
    form: FormGroup,
    mockObject: any,
    condition: (value: any) => boolean
  ) {
    for (const [key, value] of Object.entries(mockObject)) {
      expect(condition(form.controls[key].value)).toBeTruthy();
    }
  }

  async expectAllFormControlValueToBeNull(form: FormGroup, mockObject: any) {
    await this.expectAllFormControlValues(form, mockObject, (value) => value === null);
  }

  async expectAllFormControlValueToBeDefined(form: FormGroup, mockObject: any) {
    await this.expectAllFormControlValues(form, mockObject, (value) => value !== undefined);
  }

  async expectAllFormControlValueToBeUndefined(form: FormGroup, mockObject: any) {
    await this.expectAllFormControlValues(form, mockObject, (value) => value === undefined);
  }

  // Other methods...
}
