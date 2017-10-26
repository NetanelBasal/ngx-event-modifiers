import { PreventDefaultDirective, StopPropagationDirective, SelfDirective, ClickOnceDirective, ClickOutsideDirective } from './event-modifiers.directives';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'test',
  template: `
    <button (click.stop)="onClick()">Click</button>`
})
class TestComponent {
  onClick() {
    console.log('Clicked');
  }
}

describe('Event Modifiers', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, StopPropagationDirective, ClickOutsideDirective, PreventDefaultDirective, SelfDirective, ClickOnceDirective],
    });
  });

  afterEach(() => {
    jest.resetAllMocks()
  });

  describe('StopPropagationDirective', () => {
    it('should call the event handler and stopPropagation', () => {
      let fixture = createComp(`<button (click.stop)="onClick()">Click</button>`);

      const onClickSpy = jest.spyOn(fixture.componentInstance, 'onClick');
      const logSpy = jest.spyOn(console, 'log');
      const button = fixture.debugElement.query(By.css('button'));

      fixture.detectChanges();
      const event = {
        stopPropagation: () => {
        }
      };
      const spyStopPropagation = jest.spyOn(event, 'stopPropagation');
      button.triggerEventHandler('click', event);
      expect(onClickSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
      expect(spyStopPropagation).toHaveBeenCalled();
    });

    it('should be able to pass data', () => {
      let fixture = createComp(`<button (click.stop)="onClick($event, 'data')">Click</button>`);
      const onClickSpy = jest.spyOn(fixture.componentInstance, 'onClick');
      const button = fixture.debugElement.query(By.css('button'));

      fixture.detectChanges();
      const event = {
        stopPropagation() {
        }
      };
      button.triggerEventHandler('click', event);
      expect(onClickSpy).toHaveBeenCalledWith(event, 'data');
    });
  });

  describe('PreventDefaultDirective', () => {
    it('should call the event handler and preventDefault', () => {
      let fixture = createComp(`<button (click.prevent)="onClick()">Click</button>`);

      const onClickSpy = jest.spyOn(fixture.componentInstance, 'onClick');
      const logSpy = jest.spyOn(console, 'log');
      const button = fixture.debugElement.query(By.css('button'));

      fixture.detectChanges();
      const event = {
        preventDefault: () => {
        }
      };
      const spyPreventDefault = jest.spyOn(event, 'preventDefault');
      button.triggerEventHandler('click', event);
      expect(onClickSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
      expect(spyPreventDefault).toHaveBeenCalled();
    });
  });

  describe('SelfDirective', () => {
    it('should call the event handler when the target is the element', () => {
      let fixture = createComp(`
         <div (click.self)="onClick()">
            <button>Click</button>
         </div>  
      `);

      const onClickSpy = jest.spyOn(fixture.componentInstance, 'onClick');
      const logSpy = jest.spyOn(console, 'log');
      const div = fixture.debugElement.query(By.directive(SelfDirective));
      fixture.detectChanges();
      const event = {
        target: div.injector.get(ElementRef).nativeElement
      };
      div.triggerEventHandler('click', event);
      expect(onClickSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
    });

    it('should not call the event handler when the target is not the element', () => {
      let fixture = createComp(`
         <div (click.self)="onClick()">
            <button>Click</button>
         </div>  
      `);

      const onClickSpy = jest.spyOn(fixture.componentInstance, 'onClick');
      const button = fixture.debugElement.query(By.css('button'));
      const div = fixture.debugElement.query(By.directive(SelfDirective));
      fixture.detectChanges();
      const event = {
        target: button.nativeElement
      };
      button.triggerEventHandler('click', event);
      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });

  describe('OnceDirective', () => {
    it('should call the handler only once', () => {
      let fixture = createComp(`<button (click.once)="onClick()">Click</button>`);
      const button = fixture.debugElement.query(By.css('button'));

      const onClickSpy = jest.spyOn(fixture.componentInstance, 'onClick');
      const logSpy = jest.spyOn(console, 'log');
      fixture.detectChanges();
      const event = {};
      button.triggerEventHandler('click', event);
      expect(onClickSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockReset();
      onClickSpy.mockReset();
      button.triggerEventHandler('click', event);
      expect(onClickSpy).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('ClickOutsideDirective', () => {
    it('should not call the handler only if not outside the current element', () => {
      let fixture = createComp(`
         <div>
            <button (click.outside)="onClick()">Click</button>
         </div>  
      `);

      const onClickSpy = jest.spyOn(fixture.componentInstance, 'onClick');
      const button = fixture.debugElement.query(By.css('button'));
      const div = fixture.debugElement.query(By.directive(ClickOutsideDirective));
      fixture.detectChanges();
      const event = {
        target: button.nativeElement
      };
      button.triggerEventHandler('click', event);
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it('should call the handler when outside the current element', () => {
      
      let fixture = createComp(`
         <div>
            <button (click.outside)="onClick()">Click</button>
         </div>  
      `);

      const onClickSpy = jest.spyOn(fixture.componentInstance, 'onClick');
      fixture.detectChanges();
      document.dispatchEvent(new Event("click"))
      expect(onClickSpy).toHaveBeenCalled();
    });
  });
});

/**
 *
 * @param template
 * @returns {ComponentFixture<TestComponent>}
 */
function createComp( template ) {
  return TestBed.overrideComponent(TestComponent, {
    set: {
      template
    }
  }).createComponent(TestComponent);
}
