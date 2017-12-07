import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

export enum ESeparatorKeyCode {
  COMMA = 188, SPACE = 32, ENTER = 13, TAB = 9, BACKSPACE = 8
}

@Directive({
  selector: '[appInputTags]'
})
export class InputTagsDirective {

  @Input() inputId: string;
  @Output() comma: EventEmitter<any> = new EventEmitter();
  @Output() space: EventEmitter<any> = new EventEmitter();
  @Output() enter: EventEmitter<any> = new EventEmitter();
  @Output() tab: EventEmitter<any> = new EventEmitter();
  @Output() backspace: EventEmitter<any> = new EventEmitter();
  @Output() separatorTyped: EventEmitter<ESeparatorKeyCode> = new EventEmitter();

  constructor() { }

  @HostListener('document:keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent) {
    if (event.keyCode === ESeparatorKeyCode.ENTER) {
      this.separatorTyped.emit(ESeparatorKeyCode.ENTER);
      this.enter.emit();
    } else if (event.keyCode === ESeparatorKeyCode.COMMA) {
      this.separatorTyped.emit(ESeparatorKeyCode.COMMA);
      this.comma.emit();
    } else if (event.keyCode === ESeparatorKeyCode.SPACE) {
      this.separatorTyped.emit(ESeparatorKeyCode.SPACE);
      this.space.emit();
    } else if (event.keyCode === ESeparatorKeyCode.TAB) {
      this.separatorTyped.emit(ESeparatorKeyCode.TAB);
      this.tab.emit();
    } else if (event.keyCode === ESeparatorKeyCode.BACKSPACE) {
      this.backspace.emit();
    }
  }

}
