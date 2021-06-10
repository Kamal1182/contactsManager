import { Component, OnInit } from '@angular/core';
import { Contact } from '../../shared/model/contact.model';
import { ApiService } from '../../shared/services/api/api.service';
import { AuthService } from '../../shared/services/auth/auth.service';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts!: Contact[];

  seachTerm: string = '';

  breakpoint!: number;

  constructor(public api: ApiService, private auth: AuthService) { 
    api.refreshCall$.subscribe(
      () => {
        this.refeshContacts(null);
      }  
    );
  }

  ngOnInit(): void {

    this.breakpoint = (window.innerWidth <= 907) ? 2 : 3;

    //this.contacts = this.api.get('contacts').unsubscribe;

    this.api.get('contacts')
      .subscribe(data => {
        this.contacts = data;
      });
  }

  refeshContacts(event: null){
    this.ngOnInit();
  }

  onResize(event: any) {
    if(event.target.innerWidth <= 608) {
      this.breakpoint = 1;
    } else if (event.target.innerWidth <= 907) {
      this.breakpoint = 2;
    } else {
      this.breakpoint = 3;
    }
  }

}
