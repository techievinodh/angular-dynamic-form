import { TestBed } from '@angular/core/testing';
import { DynamicComponentInsertionDirective } from './dynamic-component-insertion.directive';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

describe('DynamicComponentInsertionDirective', () => {
  let directive: DynamicComponentInsertionDirective;
  let mockResolver: jasmine.SpyObj<ComponentFactoryResolver>;
  let mockContainer: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicComponentInsertionDirective],
    }).compileComponents();

    directive = TestBed.inject(DynamicComponentInsertionDirective);
    mockResolver = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);
    mockContainer = jasmine.createSpyObj('ViewContainerRef', ['createComponent']);
  });
});