import { LightningElement, api, wire } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import getContactsBornBefore from '@salesforce/apex/ContactController1.getContactsBornBefore';
export default class WireApexProperty extends LightningElement {
    @api minBirthDate;
    @wire(getContactsBornBefore, { birthDate: '$minBirthDate' })
    contacts;
    handleBirthdateChange(event) {
        this.minBirthDate = event.target.value;
    }
    get errors() {
    return (this.contacts.error) ?
        reduceErrors(this.contacts.error) : [];
}

}