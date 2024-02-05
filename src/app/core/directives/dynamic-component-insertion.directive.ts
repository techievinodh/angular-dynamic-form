import {
  ComponentFactoryResolver,
  Directive,
  OnChanges,
  OnInit,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[DynamicComponent]',
})
export class DynamicComponentInsertionDirective
  implements OnChanges, OnInit
{
  constructor(
    public resolver: ComponentFactoryResolver,
    public container: ViewContainerRef
  ) {}

  ngOnChanges() {}

  ngOnInit() {}
}