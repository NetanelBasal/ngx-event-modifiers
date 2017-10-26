import { Directive, Output, EventEmitter, Renderer2, ElementRef, Input, OnDestroy } from '@angular/core';

/**
 *
 * @param func
 * @returns {()=>(any|any)}
 */
function once( func ) {
  var ran = false, memo;
  return function () {
    if( ran ) return memo;
    ran = true;
    memo = func.apply(this, arguments);
    func = null;
    return memo;
  };
};

/**
 *
 * @param preventDefault
 * @param stopProp
 * @param event
 * @private
 */
function _handleEvents( { preventDefault, stopProp }, event ) {
  preventDefault && event.preventDefault();
  stopProp && event.stopPropagation();
}

export class Cleaner implements OnDestroy {
  @Input() protected eventOptions = {
    preventDefault: null,
    stopProp: null
  }
  protected _unsubscribe;

  ngOnDestroy() {
    this._unsubscribe();
  }
}

/**
 * The click event's propagation will be stopped
 * Usage:
 * <button (click.stop)="onClick($event, extraData)" [eventOptions]="{preventDefault: true}">Click Me!!</button>
 */
@Directive({
  selector: '[click.stop]'
})
export class StopPropagationDirective extends Cleaner {
  @Output('click.stop') stopPropEvent = new EventEmitter();

  constructor( private _renderer : Renderer2, private _element : ElementRef ) {
    super();
  }

  ngOnInit() {
    this._unsubscribe = this._renderer.listen(this._element.nativeElement, 'click', event => {
      _handleEvents(this.eventOptions, event)
      event.stopPropagation();
      this.stopPropEvent.emit(event);
    });
  }
}

/**
 * The submit event will no longer reload the page
 * Usage:
 * <button (click.prevent)="onClick($event, extraData)" [eventOptions]="{stopProp: true}">Click Me!!</button>
 */
@Directive({
  selector: '[click.prevent]'
})
export class PreventDefaultDirective extends Cleaner {
  @Output('click.prevent') preventDefaultEvent = new EventEmitter();

  constructor( private _renderer : Renderer2, private _element : ElementRef ) {
    super();
  }

  ngOnInit() {
    this._unsubscribe = this._renderer.listen(this._element.nativeElement, 'click', event => {
      _handleEvents(this.eventOptions, event)
      event.preventDefault();
      this.preventDefaultEvent.emit(event);
    });
  }
}

/**
 *
 * Only trigger handler if event.target is the element itself i.e. not from a child element
 * Usage:
 * <div (click.self)="onClick($event, extraData)">
 *   <button>Click Me!!</button>
 * </div>
 *  <div (click.self)="onClick($event, extraData)"
 *       [eventOptions]="{preventDefault: true, stopProp: true}">
 *   <button>Click Me!!</button>
 * </div>
 *
 */
@Directive({
  selector: '[click.self]'
})
export class SelfDirective extends Cleaner {
  @Output('click.self') selfEvent = new EventEmitter();

  constructor( private _renderer : Renderer2, private _element : ElementRef ) {
    super();
  }

  ngOnInit() {
    this._unsubscribe = this._renderer.listen(this._element.nativeElement, 'click', event => {
      _handleEvents(this.eventOptions, event);
      if( event.target === this._element.nativeElement ) {
        this.selfEvent.emit(event);
      }
    });
  }
}

/**
 * The click event will be triggered at most once
 * Usage:
 * <button (click.once)="onClick($event, extraData)"
 *         [eventOptions]="{preventDefault: true}"
 * >Click Me!!</button>
 */
@Directive({
  selector: '[click.once]'
})
export class ClickOnceDirective extends Cleaner {
  @Output('click.once') preventDefaultEvent = new EventEmitter();

  constructor( private _renderer : Renderer2, private _element : ElementRef ) {
    super();
  }

  ngOnInit() {
    const eventFn = once(event => {
      _handleEvents(this.eventOptions, event);
      this.preventDefaultEvent.emit(event);
    });
    this._unsubscribe = this._renderer.listen(this._element.nativeElement, 'click', eventFn);
  }

}

/**
 * The click event will be triggered only if clicked outside the current element
 * Usage:
 * <button (click.outside)="onClick($event, extraData)">Click Me!!</button>
 */
@Directive({
  selector: '[click.outside]'
})
export class ClickOutsideDirective extends Cleaner {
  @Output('click.outside') clickOutsideEvent = new EventEmitter();

  constructor( private _renderer : Renderer2, private _element : ElementRef ) {
    super();
  }

  ngOnInit() {
    this._unsubscribe = this._renderer.listen('document', 'click', event => {
      _handleEvents(this.eventOptions, event);
      const clickedInside = this._element.nativeElement.contains(event.target);
      if( !clickedInside ) {
        this.clickOutsideEvent.emit(event);
      }
    });
  }
}
