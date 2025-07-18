import { Renderer2, HostListener, Directive, EventEmitter, OnInit, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[being]'
})

export class BeingDirective {
 // @Output() being: EventEmitter<any> = new EventEmitter<any>();
  @Output() being: EventEmitter<any> = new EventEmitter<any>();
  constructor(private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit() {
    console.log(this.renderer)
    this.being.emit('anything');   }
  /*@HostListener('mouseover', ['$event']) onClick(event: any) {
    this.being.emit(event);
  }*/
}
