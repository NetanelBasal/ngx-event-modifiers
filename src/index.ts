import { ClickOnceDirective, ClickOutsideDirective, PreventDefaultDirective, SelfDirective, StopPropagationDirective } from './event-modifiers.directives';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StopPropagationDirective,
    PreventDefaultDirective,
    SelfDirective,
    ClickOnceDirective,
    ClickOutsideDirective
  ],
  exports: [
    StopPropagationDirective,
    PreventDefaultDirective,
    SelfDirective,
    ClickOnceDirective,
    ClickOutsideDirective
  ]
})
export class EventModifiersModule {
  static forRoot() : ModuleWithProviders {
    return {
      ngModule: EventModifiersModule
    };
  }
}
