import { LightningElement, api, wire } from 'lwc';
import getRentId from '@salesforce/apex/controllerRent.getRentId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';


export default class LeasePage extends LightningElement {

@wire(getRentId, {optId: '$optRecordId'}) wiredRecordId;
   @api recordId = this.wiredRecordId;
   @api objectApiName;
   @api optRecordId;
 
strBook;



   handleSuccess(e) {
        // Close the modal window and display a success toast
        console.log(this.optRecordId,this.recordId,this.wiredRecordId, this.wiredRecordId.Id);

        this.dispatchEvent(new CloseActionScreenEvent());
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Opportunity Record Updated!',
                variant: 'success'
            })
        );
   }
   handleBooking(event)
   {
    this.strBook = event.target.value;
    console.log(this.strBook);
   }

   
}