import { ComponentFixture } from '@angular/core/testing';

export class BaseElementTest {
  private readonly selector: string;
  private readonly fixture: ComponentFixture<any>;

  private element: any;

  constructor(selector: string, fixture: ComponentFixture<any>) {
    this.selector = selector;
    this.fixture = fixture;
    this.element = this.getElementForSelector(selector);
  }

  get HTMLElement() {
    return this.element;
  }

  type(value: string | number) {
    if (this.element) {
      this.element.value = value;
      this.element.dispatchEvent(new Event('input'));
    }
    this.fixture.detectChanges();
    return this;
  }

  triggerChange() {
    if (this.element) this.element.dispatchEvent(new Event('change'));
    this.fixture.detectChanges();
    return this;
  }

  blur() {
    if (this.element) this.element.dispatchEvent(new Event('Blur'));
    this.fixture.detectChanges();
    return this;
  }

  focus() {
    this.element.dispatchEvent(new Event('focus'));
    this.fixture.detectChanges();
    return this;
  }

  click() {
    this.clickElement(this.element);
  }

  private clickElement(target: any) {
    if (target !== null) {
      this.fixture.detectChanges();
      target.click();
      return this;
    } else {
      throw new Error(`Element ${this.selector} could not be found`);
    }
  }

  clickLabel() {
    this.clickElement(this.getElementForSelector(`${this.selector} > label`));
  }

  mouseClick() {
    this.element.dispatchEvent(new MouseEvent('click'));
    this.fixture.detectChanges();
    return this;
  }

  getText() {
    if (this.element === null) {
      throw new Error(`Element ${this.selector} could not be found`);
    }
    return this.element.innerText;
  }

  containsText(text: string) {
    if (this.element === null) {
      throw new Error(`Element ${this.selector} could not be found`);
    }
    expect(this.getText()).toContain(text);
  }

  doesNotContainText(text: string) {
    expect(this.getText()).not.toContain(text);
  }

  /**
   * Assert if referenced element has a class present
   * @param {string} cssClass
   * @return {this<T>}
   */
  hasClass(cssClass: string) {
    expect(this.element.className.includes(cssClass)).toBeTruthy(
      `Expected class: ${cssClass} to be present on the element`
    );
    return this;
  }

  /**
   * Assert if referenced element has an attribute present
   * @param {string} attribute
   * @param {string} attributeValue
   * @return {this<T>}
   */
  hasAttribute(attribute: string, attributeValue?: string) {
    if (this.element) {
      expect(this.element.hasAttribute(attribute)).toBeTruthy(
        `Expected attribute: ${attribute} to be present on the element`
      );
      if (attributeValue) {
        expect(this.element.getAttribute(attribute)).toContain(
          attributeValue,
          `Expected attribute: ${attribute} to have a value of ${attributeValue}`
        );
      }
    }
    return this;
  }

  /**
   * Assert if referenced element has an attribute present
   * @param {string} attribute
   * @param {string} attributeValue
   * @return {this<T>}
   */
  hasAttributeNotEqualTo(attribute: string, attributeValue?: string) {
    if (this.element) {
      expect(this.element.hasAttribute(attribute)).toBeTruthy(
        `Expected attribute: ${attribute} to be present on the element`
      );
      if (attributeValue) {
        expect(this.element.getAttribute(attribute)).not.toContain(
          attributeValue,
          `Expected attribute: ${attribute} to have a value of ${attributeValue}`
        );
      }
    }
    return this;
  }

  /**
   * Assert if referenced element has a specific style property set
   * @param {string} property
   * @param {string} propertyValue
   * @return {this<T>}
   */
  hasStyle(property: string | any, propertyValue: string) {
    expect(getComputedStyle(this.element)[property]).toEqual(
      propertyValue.toLocaleLowerCase()
    );
    return this;
  }

  /**
   * Assert if referenced element does not have a specific style property set
   * @param {string} property
   * @param {string} propertyValue
   * @return {this<T>}
   */
  doesNotHaveStyle(property: string | any, propertyValue: string) {
    expect(getComputedStyle(this.element)[property]).not.toEqual(
      propertyValue.toLocaleLowerCase()
    );
    return this;
  }

  /**
   * Assert toggle slide is disabled
   * @return {this<T>}
   */
  slideToggleIsDisabled() {
    this.hasAttribute('ng-reflect-disabled', 'true');
    return this;
  }

  /**
   * Assert toggle slide is not disabled
   * @return {this<T>}
   */
  slideToggleIsNotDisabled() {
    this.hasAttribute('ng-reflect-disabled', 'false');
    return this;
  }

  doesNotHaveClass(cssClass: string) {
    expect(this.element.className.includes(cssClass)).toBeFalsy(
      `Expected class: ${cssClass} to not be present on the element`
    );
    return this;
  }

  hasText(text: string) {
    expect(this.getText()).toEqual(text);
  }

  isNotPresent() {
    expect(this.element).toBeNull();
    return this;
  }

  async CheckboxChecked() {
    await this.fixture.whenRenderingDone();
    await this.fixture.whenStable();

    expect(this.element['checked']).toBeTruthy(
      `expected element ${this.selector} to be checked`
    );

    return this;
  }

  async CheckboxIsNotChecked() {
    await this.fixture.whenRenderingDone();
    await this.fixture.whenStable();

    expect(this.element['checked']).toBeFalsy(
      `expected element ${this.selector} to be unchecked`
    );

    return this;
  }

  checkboxIsChecked() {
    expect(
      this.element['checked'] ||
        this.element.getAttribute('ng-reflect-checked', 'true')
    ).toBeTruthy();

    return this;
  }

  checkboxIsNotChecked() {
    expect(
      !this.element['checked'] ||
        this.element.getAttribute('ng-reflect-checked', 'false')
    ).toBeTruthy();
    return this;
  }

  radioButtonClick() {
    const target = this.getElementForSelector(
      `${this.selector} input.-radio-input`
    );
    this.clickElement(target);
    return this;
  }

  radioButtonIsChecked() {
    const theElement = this.getElementForSelector(
      `${this.selector}.-radio-checked`
    );
    expect(theElement).toBeTruthy();
    return this;
  }

  radioButtonIsNotChecked() {
    const theElement = this.getElementForSelector(
      `${this.selector}.-radio-checked`
    );
    expect(theElement).toBeFalsy();
    return this;
  }

  slideToggleIsChecked() {
    expect(this.element.className.includes('-checked')).toBeTruthy();
    return this;
  }

  slideToggleIsNotChecked() {
    expect(this.element.className.includes('-checked')).toBeFalsy();
    return this;
  }

  isCheckboxChecked() {
    const theElement = this.getElementForSelector(
      `${this.selector}.-checkbox-checked`
    );
    expect(theElement).toBeTruthy();
    return this;
  }

  selectContainsText(value: string) {
    expect(this.getText().includes(value)).toBeTruthy();
    return this;
  }

  selectValueContainsText(value: string) {
    const theElement = this.getElementForSelector(
      `${this.selector} .-select-value-text span`
    );
    expect(theElement).toBeTruthy(`Select ${this.selector} has no value`);
    expect(theElement.innerHTML).toContain(
      value,
      `Select ${this.selector} value "${theElement.innerHTML}" does not contain ${value}.`
    );
  }

  selectValueEmpty() {
    const theElement = this.getElementForSelector(
      `${this.selector} .-select-value-text span`
    );
    expect(theElement).toBeFalsy(
      `Select ${this.selector} has a value "${theElement.innerHTML}"`
    );
  }

  buttonIsDisabled() {
    if (this.element)
      expect(this.element.hasAttribute('disabled')).toBeTruthy();
    return this;
  }

  isNotDisabled() {
    if (this.element) expect(this.element.hasAttribute('disabled')).toBeFalsy();
    return this;
  }

  isPresent() {
    expect(this.element).not.toBeNull(
      `Expected element "${this.selector}" to be present`
    );
    return this;
  }

  toBeTruthy() {
    expect(this.element).toBeTruthy();
    return this;
  }
  
  toBeFalsy() {
    expect(this.element).toBeFalsy();
    return this;
  }
  
  isNotDisplayed() {
    if (this.element === null) {
      throw new Error(
        `Element ${this.selector} could not be found. \nDid you mean to use isNotPresent()?`
      );
    }
    expect(
      this.element.hasAttribute('hidden') ||
        this.element.style.visibility === 'hidden'
    ).toBe(true);
    return this;
  }

  isDisplayed() {
    if (this.element === null) {
      throw new Error(`Element ${this.selector} could not be found`);
    }
    expect(
      this.element.hasAttribute('hidden') &&
        this.element.style.visibility === 'hidden'
    ).toBe(false);
    return this;
  }
  isElementNotDisplayed() {
    if (this.element === null) {
      throw new Error(
        `Element ${this.selector} could not be found. \nDid you mean to use isNotPresent()?`
      );
    }
    expect(
        this.element.style.display === 'none'
    ).toBe(true);
    return this;
  }

  isElementDisplayed() {
    if (this.element === null) {
      throw new Error(`Element ${this.selector} could not be found`);
    }
    expect(
     this.element.style.display === 'block'
    ).toBe(true);
    return this;
  }
  async CheckboxDisabled() {
    await this.fixture.whenRenderingDone();
    await this.fixture.whenStable();

    expect(this.element.className.includes('checkbox-disabled')).toBeTruthy(
      `Expected element "${this.selector}" to be disabled`
    );
    return this;
  }

  async CheckboxEnabled() {
    await this.fixture.whenRenderingDone();
    await this.fixture.whenStable();

    expect(this.element.className.includes('checkbox-disabled')).toBeFalsy(
      `Expected element "${this.selector}" to be enabled`
    );
    return this;
  }

  async ToggleDisabled() {
    await this.fixture.whenRenderingDone();
    await this.fixture.whenStable();

    expect(this.element.className.includes('toggle-disabled')).toBeTruthy(
      `Expected element "${this.selector}" to be disabled`
    );
    return this;
  }

  async ToggleEnabled() {
    await this.fixture.whenRenderingDone();
    await this.fixture.whenStable();

    expect(this.element.className.includes('toggle-disabled')).toBeFalsy(
      `Expected element "${this.selector}" to be enabled`
    );
    return this;
  }

  async ToggleNotChecked() {
    await this.fixture.whenRenderingDone();
    await this.fixture.whenStable();

    expect(this.element.className.includes('toggle-checked')).toBeFalsy(
      `Expected element "${this.selector}" to be unchecked`
    );
    return this;
  }

  async ToggleChecked() {
    await this.fixture.whenRenderingDone();
    await this.fixture.whenStable();

    expect(this.element.className.includes('toggle-checked')).toBeTruthy(
      `Expected element "${this.selector}" to be checked`
    );
    return this;
  }

  isDisabled() {
    if (this.element)
      expect(this.element.hasAttribute('disabled')).toBeTruthy(
        `Expected element "${this.selector}" to be disabled`
      );
    return this;
  }

  isEnabled() {
    if (this.element) expect(this.element.hasAttribute('disabled')).toBeFalsy();
    return this;
  }

  // Use this for inputs or text areas
  inputContainsText(value: any) {
    expect(this.element.value).toBe(value);
  }

  currencyInputContainsText(value: any) {
    if (this.element)
      expect(this.element.getAttribute(`ng-reflect-model`)).toContain(value);
  }

  private getElementForSelector(theSelector: string) {
    return this.fixture.nativeElement.querySelector(theSelector);
  }

  matchNumeric() {
    this.fixture.detectChanges();
    if (this.element)
      expect(this.element.getAttribute('value')).toMatch(/^[0-9]+$/);
    return this;
  }

  beLessThanOrEqual(value: number) {
    this.fixture.detectChanges();
    //if(this.element)
    expect(this.element.getAttribute('value')).toBeLessThanOrEqual(value);
    return this;
  }

  matchAlphaNumeric() {
    this.fixture.detectChanges();
    if (this.element)
      expect(this.element.getAttribute('value')).toMatch(/^[a-zA-Z0-9_]*$/);
    return this;
  }
}
