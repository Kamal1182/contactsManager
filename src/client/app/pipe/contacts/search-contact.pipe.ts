import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../../shared/model/contact.model';


@Pipe({
  name: 'searchContact'
})
export class SearchContactPipe implements PipeTransform {

  transform(contacts: Contact[], pipeModifier: String): Contact[] {
    if ( !contacts || !pipeModifier ) {
      return contacts;
    } 
    
    return contacts.filter( eachItem => {
      return (
        eachItem.name ? eachItem.name.toLowerCase().includes(pipeModifier.toLowerCase()) : 
                        eachItem.firstName.toLowerCase().includes(pipeModifier.toLowerCase()) || 
                        eachItem.lastName.toLowerCase().includes(pipeModifier.toLowerCase())
      )
    });
  }

}
