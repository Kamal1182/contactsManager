import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm ,FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FileValidator } from 'ngx-material-file-input';

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
  imageBase64 = {extension:"", data:""};
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
              private EditDialogRef: MatDialogRef<EditContactModalComponent>,
              @Inject(MAT_DIALOG_DATA) data: Contact,
              private _EditedContactsnackBar: MatSnackBar,
              public api: ApiService) { 

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

  close() {

  }

  save() {

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
      photoUrl  : this.imageBase64
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
          console.log('from edit-contact-modal.component.js' + JSON.stringify(data.error));
          data.error.firstName ? (
                                  this.editContactForm.get('firstName')?.setErrors({ [`${data.error.firstName}`] : true}),
                                  this.firstnameServerError = data.error.firstName
                                 ) : null;
          data.error.lastName  ? (
                                  this.editContactForm.get('lastName')?.setErrors({ [`${data.error.lastName}`] : true}),
                                  this.lastnameServerError = data.error.lastName
                                 ) : null;
          data.error.address  ? (
                                  this.editContactForm.get('address')?.setErrors({ [`${data.error.address}`] : true}),
                                  this.addressServerError = data.error.address
                                 ) : null;
          data.error.areaCode  ? (
                                  this.editContactForm.get('areaCode')?.setErrors({ [`${data.error.areaCode}`] : true}),
                                  this.areaCodeServerError = data.error.areaCode
                                 ) : null;
          data.error.prefix  ? (
                                  this.editContactForm.get('prefix')?.setErrors({ [`${data.error.prefix}`] : true}),
                                  this.prefixCodeServerError = data.error.prefix
                                 ) : null;
          data.error.lineNumber  ? (
                                  this.editContactForm.get('lineNumber')?.setErrors({ [`${data.error.lineNumber}`] : true}),
                                  this.landLineCodeServerError = data.error.lineNumber
                                 ) : null;
          data.error.photoUrl  ? (
                                  this.editContactForm.get('photo')?.setErrors({ [`${data.error.photoUrl}`] : true}),
                                  this.photoServerError = data.error.photoUrl
                                 ) : null;
          this.photoServerError = data.error.photoUrl;
          this.editContactForm.markAllAsTouched();
          this.loading = false;
          // this.editContactForm.reset(this.editContactForm.value);
        } else {
          //this.editContactForm.reset();
          this.loading = true;
          this.contactEdited = data.value;
          console.log(this.contactEdited);
          this._EditedContactsnackBar.open(`${this.contactEdited.firstName} ${this.contactEdited.lastName}`, 'Updated!', {duration: 5000} );
          this.api.makeRefresh();
          this.EditDialogRef.close();
       }
      });
  }

  private resetAll() {
    this.loading = false;
    // this.editContactModal.dismissAll();
    this.EditDialogRef.close();
    
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