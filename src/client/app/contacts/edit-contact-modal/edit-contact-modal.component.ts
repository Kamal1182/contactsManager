import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm ,FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Contact } from '../../shared/model/contact.model';
import { ApiService } from '../../shared/services/api/api.service';

@Component({
  selector: 'app-edit-contact-modal',
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.css']
})
export class EditContactModalComponent implements OnInit {

  contact: Contact;

  contactEdited!: Contact;

  //define the variable containing the image extension and ASCII data
  imageBase64 = {};
  choosenImage = ""

  editContactForm!: FormGroup;

  loading: Boolean = false;

  breakpoint!: number;

  addressFieldWidth!: number;

  firstnameServerError = '';
  lastnameServerError = '';
  addressServerError = '';
  areaCodeServerError = '';
  prefixCodeServerError = '';
  landLineCodeServerError = '';
  photoServerError = '';

  @ViewChild('gridList') gridList: any;
  @ViewChild('img') img: any;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<EditContactModalComponent>,
              @Inject(MAT_DIALOG_DATA) data: Contact,
              private api: ApiService) { 

                this.contact = data;
              
              }

  ngOnInit(): void {
    this.editContactForm = this.fb.group({
      firstName:  [this.contact.name ? this.contact.name : this.contact.firstName, Validators.required],
      lastName:   [this.contact.name ? "" : this.contact.lastName, Validators.required],
      address:    [this.contact.address, Validators.required],
      areaCode:   [this.contact.areaCode, Validators.compose
                    ([
                      Validators.maxLength(5),
                      Validators.required
                    ])
              ],
      prefix:     [this.contact.prefix, Validators.compose
                    ([
                      Validators.maxLength(3),
                      Validators.required
                    ])
              ],
      lineNumber: [this.contact.lineNumber, Validators.compose
                    ([
                      Validators.maxLength(4),
                      Validators.required
                    ])
              ],
      photo:      ["", Validators.compose
                    ([
                      // RxwebValidators.required(),
                      // RxwebValidators.image({maxHeight:800,maxWidth:800}),
                      // RxwebValidators.extension({extensions:["jpeg","jpg","gif"]})
                    ])              
              ]
      })
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; 
  }

  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
    this.addressFieldWidth = this.gridList._element.nativeElement.offsetWidth;
  }

  ngAfterViewInit() {
    // this.addressFieldWidth = this.gridList._element.nativeElement.offsetWidth;
    setTimeout(() => {this.addressFieldWidth = this.gridList._element.nativeElement.offsetWidth;},0)
    // Promise.resolve().then(()=> this.addressFieldWidth = this.gridList._element.nativeElement.offsetWidth )
  }

  close() {

  }

  save() {

  }

  // fileChangeEvent(E) {
  //   if(E != undefined){
  //     //this.imageBase64["extension"] = E.target.files[0].name.split('.')[1];
  //     this.imageBase64["extension"] = E.target.files[0].type.replace(/^.*[\\\/]/, '');
  //     var files = E.target.files;
  //     var file = files[0];
      
  //     if (files && file) {
  //       var reader = new FileReader();
        
  //       reader.onload = this._handleReaderLoaded.bind(this);

  //       reader.readAsBinaryString(file);
        
  //     }
  //   }
  // }

  // _handleReaderLoaded(readerEvt) {
  //   //console.log(readerEvt);
  //   var binaryString = readerEvt.target.result;
  //   //this.imageBase64["data"] = binaryString;
  //   this.imageBase64["data"] = btoa(binaryString);
  //   this.choosenImage = 'data:image/jpeg;base64,' + this.imageBase64["data"];
  // }  

  onSubmit() {
    this.loading = true;

    const formValues = Object.assign({}, this.editContactForm.value);

     const contact : Contact = {
      _id: this.contact._id,
      name      : formValues.name,
      firstName : formValues.firstName,
      lastName  : formValues.lastName,
      address   : formValues.address,
      phone     : formValues.phone,
      areaCode  : formValues.areaCode,
      prefix    : formValues.prefix,
      lineNumber: formValues.lineNumber,
      // photoUrl  : this.imageBase64
      photoUrl  : this.img.src
    };

    //console.log(contact);
    //this.loading = false;
    //this.editContactForm.reset(this.editContactForm.value);
    this.api.put( 'contacts/'+this.contact._id, contact )
      .subscribe(data => {
        if ( data.statusCode == 401 ) {
          alert( data.error );
          this.resetAll();
        } else if ( data.statusCode == 422 ){
          console.log('from add-contact.component.js' + JSON.stringify(data.error));
          this.firstnameServerError = data.error.firstName;
          this.lastnameServerError = data.error.lastName;
          this.addressServerError = data.error.address;
          this.areaCodeServerError = data.error.areaCode;
          this.prefixCodeServerError = data.error.prefix;
          this.landLineCodeServerError = data.error.lineNumber;
          this.photoServerError = data.error.photoUrl;
          this.loading = false;
          this.editContactForm.reset(this.editContactForm.value);
        } else {
          //this.editContactForm.reset();
          this.loading = false;
          this.contactEdited = data.value;
          console.log(this.contactEdited);
          this.api.makeRefresh();
       }
      });
  }

  private resetAll() {
    this.loading = false;
    // this.editContactModal.dismissAll();
    this.dialogRef.close();
    
    this.firstnameServerError = '';
    this.lastnameServerError = '';
    this.addressServerError = '';
    this.areaCodeServerError = '';
    this.prefixCodeServerError = '';
    this.landLineCodeServerError = '';
    this.photoServerError = '';
    this.ngOnInit();
  }

}