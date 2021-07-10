import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm ,FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Contact } from '../../shared/model/contact.model';

@Component({
  selector: 'app-edit-contact-modal',
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.css']
})
export class EditContactModalComponent implements OnInit {

  contact: Contact;

  editContactForm!: FormGroup;

  loading: Boolean = false;

  public breakpoint!: number;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<EditContactModalComponent>,
              @Inject(MAT_DIALOG_DATA) data: Contact) { 

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
  }

  close() {

  }

  save() {

  }

  onSubmit() {

  }

}