import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import {UploadFileComponent} from './upload-file/upload-file.component';

// The following code is only used for uploading files
// most of it is not used but it is there in case it can become useful
@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  constructor (private uploadfilecomponent : UploadFileComponent,){}
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#f5fcff'
  @HostBinding('style.opacity') private opacity = '1'


  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8'
  }
  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
  }
  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
    let files = evt.dataTransfer.files;


 		var reader = new FileReader();
 		reader.onload = () => {
    //this.uploadfilecomponent.fileContent= reader.result as string
  };
 		reader.onloadend = () => {reader = null;};
 		reader.readAsText( files[0] );

    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }

  }

}
