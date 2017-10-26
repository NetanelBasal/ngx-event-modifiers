# ngx-event-modifiers
## Event Modifiers for Angular Applications (inspired by Vue)

### Installation

To install this library, run:

```bash
$ npm install ngx-event-modifiers --save
```
```typescript
import { EventModifiersModule } from 'ngx-event-modifiers';

@NgModule({
  imports: [
    EventModifiersModule
  ]
})
export class AppModule { }
```

#### Usage
- `(click.stop)` - The click event's propagation will be stopped
```html
  <button (click.stop)="onClick($event, extraData)">Click Me!!</button>
```
- `(click.prevent)` - The submit event will no longer reload the page
```html
  <button (click.prevent)="onClick($event, extraData)" type="submit">Click Me!!</button>
```
- `(click.self)` - Only trigger handler if event.target is the element itself i.e. not from a child element
```html
  <div (click.self)="onClick($event, extraData)">
    <button>Click Me!!</button>
  </div>
```
- `(click.once)` - The click event will be triggered at most once
```html
  <button (click.once)="onClick($event, extraData)">Click Me!!</button>
```
- `(click.outside)` - The click event will be triggered only if clicked outside the current element
```html
  <div>
    <button (click.outside)="onClick($event, extraData)">Click Me!!</button>
  </div>
```
You can also pass `[eventOptions]`:
```html
  <div (click.self)="onClick($event, extraData)"
       [eventOptions]="{preventDefault: true, stopProp: true}">
     <button>Click Me!!</button>
  </div>
```
## License

MIT © [Netanel Basal](mailto:netanel7799@gmail.com)
