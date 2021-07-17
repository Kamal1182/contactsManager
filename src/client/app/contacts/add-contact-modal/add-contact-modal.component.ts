import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm ,FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FileValidator } from 'ngx-material-file-input';

import { Contact } from '../../shared/model/contact.model';
import { ApiService } from '../../shared/services/api/api.service';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.css']
})
export class AddContactModalComponent implements OnInit {

  contact: Contact;

  newContact!: Contact;

  //define the variable containing the image extension and ASCII data
  imageBase64 = {extension:"", data:""};
  choosenImage = ""

  addContactForm!: FormGroup;

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
              private dialogRef: MatDialogRef<AddContactModalComponent>,
              @Inject(MAT_DIALOG_DATA) data: Contact,
              private _EditedContactsnackBar: MatSnackBar,
              private api: ApiService) {

                this.contact = data;

              }

  ngOnInit(): void {
    this.addContactForm = this.fb.group({
      firstName:  ["", Validators.required],
      lastName:   ["", Validators.required],
      address:    ["", Validators.required],
      areaCode:   ["", Validators.compose
                    ([
                      Validators.maxLength(5),
                      Validators.required
                    ])
              ],
      prefix:     ["", Validators.compose
                    ([
                      Validators.maxLength(3),
                      Validators.required
                    ])
              ],
      lineNumber: ["", Validators.compose
                    ([
                      Validators.maxLength(4),
                      Validators.required
                    ])
              ],
       photo:      ["", [Validators.required, FileValidator.maxContentSize(307200)] ]
      // photo:      ["", Validators.compose
      //               ([
      //                 RxwebValidators.required(),
      //                 RxwebValidators.image({maxHeight:800,maxWidth:800}),
      //                 RxwebValidators.extension({extensions:["jpeg","jpg","gif"]})
      //               ])              
      //         ]
      })
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2;
  }

  onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
    this.addressFieldWidth = this.gridList._element.nativeElement.offsetWidth;
  }

  ngAfterViewInit() {
    // this.addressFieldWidth = this.gridList._element.nativeElement.offsetWidth;
    setTimeout(() => {this.addressFieldWidth = this.gridList._element.nativeElement.offsetWidth;},0)
    // Promise.resolve().then(()=> this.addressFieldWidth = this.gridList._element.nativeElement.offsetWidth )
  }

  fileChangeEvent(E : any) {
    if(E != undefined){
      //this.imageBase64["extension"] = E.target.files[0].name.split('.')[1];
      this.imageBase64["extension"] = E.target.files[0].type.replace(/^.*[\\\/]/, '');
      var files = E.target.files;
      var file = files[0];
      
      if (files && file) {
        var reader = new FileReader();
        
        reader.onload = this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
        
      }
    }
  }

  _handleReaderLoaded(readerEvt : any) {
    //console.log(readerEvt);
    var binaryString = readerEvt.target.result;
    //this.imageBase64["data"] = binaryString;
    this.imageBase64["data"] = btoa(binaryString);
    this.choosenImage = 'data:image/jpeg;base64,' + this.imageBase64["data"];
  }  

  onSubmit() {
    this.loading = true;

    const formValues = Object.assign({}, this.addContactForm.value);

     const contact : Contact = {
      _id       : undefined,
      name      : formValues.name,
      firstName : formValues.firstName,
      lastName  : formValues.lastName,
      address   : formValues.address,
      phone     : formValues.phone,
      areaCode  : formValues.areaCode,
      prefix    : formValues.prefix,
      lineNumber: formValues.lineNumber,
      photoUrl  : this.imageBase64
    };

    //console.log(contact);
    //this.loading = false;
    //this.addContactForm.reset(this.addContactForm.value);
    this.api.post( 'contacts/', contact )
      .subscribe(data => {
        if ( data.statusCode == 401 ) {
          alert( data.error );
          this.resetAll();
        } else if ( data.statusCode == 422 ){
          console.log('from edit-contact-modal.component.js' + JSON.stringify(data.error));
          data.error.firstName ? (
                                  this.addContactForm.get('firstName')?.setErrors({ [`${data.error.firstName}`] : true}),
                                  this.firstnameServerError = data.error.firstName
                                 ) : null;
          data.error.lastName  ? (
                                  this.addContactForm.get('lastName')?.setErrors({ [`${data.error.lastName}`] : true}),
                                  this.lastnameServerError = data.error.lastName
                                 ) : null;
          data.error.address   ? (
                                  this.addContactForm.get('address')?.setErrors({ [`${data.error.address}`] : true}),
                                  this.addressServerError = data.error.address
                                 ) : null;
          data.error.areaCode  ? (
                                  this.addContactForm.get('areaCode')?.setErrors({ [`${data.error.areaCode}`] : true}),
                                  this.areaCodeServerError = data.error.areaCode
                                 ) : null;
          data.error.prefix    ? (
                                  this.addContactForm.get('prefix')?.setErrors({ [`${data.error.prefix}`] : true}),
                                  this.prefixCodeServerError = data.error.prefix
                                 ) : null;
          data.error.lineNumber? (
                                  this.addContactForm.get('lineNumber')?.setErrors({ [`${data.error.lineNumber}`] : true}),
                                  this.landLineCodeServerError = data.error.lineNumber
                                 ) : null;
          data.error.photoUrl  ? (
                                  this.addContactForm.get('photo')?.setErrors({ [`${data.error.photoUrl}`] : true}),
                                  this.photoServerError = data.error.photoUrl
                                 ) : null;
          this.photoServerError = data.error.photoUrl;
          this.addContactForm.markAllAsTouched();
          this.loading = false;
          // this.addContactForm.reset(this.addContactForm.value);
        } else {
          //this.addContactForm.reset();
          this.loading = false;
          this.newContact = data;
          console.log(this.newContact);
          this._EditedContactsnackBar.open(`${this.newContact.firstName} ${this.newContact.lastName}`, 'Added!', {duration: 5000} );
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
