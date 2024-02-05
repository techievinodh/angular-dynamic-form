import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  TestBedStatic,
} from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BaseElementTest } from './base-element-test';

/**
 * @class TestBase<T>
 * @classdesc TestBase manages the fixture and test bed to facilitate development of tests
 */
export abstract class TestBase<T> {
  /**
   * @name getFixture
   * @description Gets the test bed fixture
   * @return {fixture} - The fixture for the already created test bed
   */
  get getFixture(): ComponentFixture<T> {
    return this.fixture;
  }

  private fixture!: ComponentFixture<T>;
  private component!: T;

  constructor(
    private readonly coreModules = [],
    private readonly coreProviders = [],
    private readonly ukgProTestModules = []
  ) {}

  /**
   * @name overrideModules
   * @param testBed - this is the initialized test bed for which you can override imports and declarations for
   *  stubbing and mocking purposes.
   */
  abstract overrideModules(testBed: TestBed): TestBed;

  /**
   * @name createTestBed
   * @description creates the test bed using default modules/declarations/providers as well as any provided by the tester
   * @argument {any[]} imports - modules to be imported into the test bed
   * @argument {any[]} declarations - Directives/components to import
   * @argument {any[]} providers - services and mocks to be provided directly in the test bed.
   * @return {Promise<boolean>} - resolves when the test bed is created
   */
  async createTestBed(
    declarations: any[] = [],
    imports: any[] = [],
    providers: any[] = [],
    isShallow = true,
    isDestroyAfterEach = true
  ) {
    const configureTestModule: Promise<any> = this.overrideModules(
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

  /**
   *
   * @param component
   * @returns
   */
  queryChildElementFromComponent(
    elementSelector: string,
    componentSelector: string
  ) {
    this.fixture.detectChanges();
    return this.fixture.debugElement.query(By.css(componentSelector));
  }

  /**
   * @name createComponent
   * @description recreates the component in the already created test bed
   * @argument {Class T extends ComponentRef} component - the component to be created using this test bed
   * @return {instanceof T} - The created component
   */
  createComponent(component: Type<T>) {
    this.fixture = TestBed.createComponent(component);
    this.component = this.fixture.componentInstance;
    return this.component;
  }

  /**
   * @name getElement
   * @description Gets an element matching the given selector
   * @argument {string} selector - The css selector used to find the element
   * @return {ComponentElementTest} - The first element matching the selector
   */
  getElement(selector: string): BaseElementTest {
    this.fixture.detectChanges();
    return new BaseElementTest(selector, this.fixture);
  }

  // async expectAllFormControlValueToBeNull(form: FormGroup, mockObject: any) {
  //   for (let [key, value] of Object.entries(mockObject)) {
  //     expect(form.controls[key].value).toBeNull();
  //   }
  // }
  /**
 * This function expects all form control values in the provided FormGroup to be null,
 * based on the values specified in the mockObject.
 * @param form - The FormGroup to be tested.
 * @param mockObject - An object specifying the expected null values for each form control.
 */
async expectAllFormControlValueToBeNull(form: FormGroup, mockObject: any): Promise<void> {
  // Iterate through each key-value pair in the mockObject
  for (const [key, expectedValue] of Object.entries(mockObject)) {
    // Ensure the form control exists
    if (form.controls[key]) {
      // Assert that the form control value is null
      expect(form.controls[key].value).withContext(`Expected '${key}' control value to be null.`);
    } else {
      // Log a warning if the form control doesn't exist
      console.warn(`Form control '${key}' not found in FormGroup.`);
    }
  }
}

// Example usage:
// const myFormGroup = new FormGroup({
//   control1: new FormControl(null),
//   control2: new FormControl(null),
//   // ... other controls
// });

// const myMockObject = {
//   control1: null,
//   control2: null,
//   // ... other controls with expected null values
// };

// await expectAllFormControlValueToBeNull(myFormGroup, myMockObject);


  // async expectAllFormControlValueToBeDefined(form: FormGroup, mockObject: any) {
  //   for (let [key, value] of Object.entries(mockObject)) {
  //     expect(form.controls[key].value).toBeDefined();
  //   }
  // }
  /**
 * This function expects all form control values in the provided FormGroup to be defined,
 * based on the values specified in the mockObject.
 * @param form - The FormGroup to be tested.
 * @param mockObject - An object specifying the expected defined values for each form control.
 */
async expectAllFormControlValueToBeDefined(form: FormGroup, mockObject: any): Promise<void> {
  // Iterate through each key-value pair in the mockObject
  for (const [key, expectedValue] of Object.entries(mockObject)) {
    // Ensure the form control exists
    if (form.controls[key]) {
      // Assert that the form control value is defined
      expect(form.controls[key].value).toBeDefined(`Expected '${key}' control value to be defined.`);
    } else {
      // Log a warning if the form control doesn't exist
      console.warn(`Form control '${key}' not found in FormGroup.`);
    }
  }
}

// Example usage:
// const myFormGroup = new FormGroup({
//   control1: new FormControl('value1'),
//   control2: new FormControl('value2'),
//   // ... other controls
// });

// const myMockObject = {
//   control1: 'value1',
//   control2: 'value2',
//   // ... other controls with expected defined values
// };

// await expectAllFormControlValueToBeDefined(myFormGroup, myMockObject);


  async expectAllFormControlValueToBeUndefined(
    form: FormGroup,
    mockObject: any
  ) {
    for (let [key, value] of Object.entries(mockObject)) {
      expect(form.controls[key].value).toBeUndefined();
    }
  }

  async expectAllFormControlValueToEqual(form: FormGroup, mockObject: any) {
    form.patchValue(mockObject);
    this.waitForComponentToBeStable();
    for (let [key, value] of Object.entries(mockObject)) {
      if (form.controls[key]) expect(form.controls[key].value).toEqual(value);
    }
  }
  async expectAllDuplicateFormControlValueToEqual(
    form: FormGroup,
    mockObject: any
  ) {
    form.patchValue(mockObject);
    this.waitForComponentToBeStable();
    for (let [key, value] of Object.entries(mockObject)) {
      expect(form.controls[key].value).toEqual(value);
    }
  }
  async expectAllFormControlValidatorToBeNull(
    form: FormGroup,
    mockObject: any
  ) {
    for (let [key, value] of Object.entries(mockObject)) {
      expect(form.controls[key].validator).toBeNull();
    }
  }

  async expectAllFormControlValidatorToBeDefined(
    form: FormGroup,
    mockObject: any
  ) {
    for (let [key, value] of Object.entries(mockObject)) {
      expect(form.controls[key].validator).toBeDefined();
    }
  }

  async expectAllFormControlValidatorToBeUndefined(
    form: FormGroup,
    mockObject: any
  ) {
    for (let [key, value] of Object.entries(mockObject)) {
      expect(form.controls[key].validator).toBeUndefined();
    }
  }

  /**
   * @name waitForComponentToBeStable
   * @description Wait for the component to become stable
   * @return {Promise<any>} - A promise representing the fixture stability
   */
  async waitForComponentToBeStable() {
    if (!this.fixture.isStable()) {
      await this.fixture.whenRenderingDone();
      await this.fixture.whenStable();
    }
  }

  /**
   * @name detect
   * @description Manually detect changes
   * @return {ComponentTest<T>} - For chaining purposes
   */
  detect(): this {
    this.fixture.detectChanges();
    return this;
  }

  equalValue(value: any, compareValue: any) {
    expect(value).toEqual(compareValue);
  }

  /**
   * @name createSpy
   * @description Create a spy object
   */
  createSpy(type: any, methods: string[], baseName?: string) {
    if (baseName) {
      return jasmine.createSpyObj<typeof type>(baseName, methods);
    }
    return jasmine.createSpyObj<typeof type>(methods);
  }

  checkDefined(element:any) {
    expect(element).toBeDefined();
  }

  checkHaveBeenCalled(method:any) {
    expect(method).toHaveBeenCalled();
  }
}
