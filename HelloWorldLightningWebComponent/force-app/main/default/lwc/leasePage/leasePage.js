import { LightningElement, api, track, wire } from 'lwc';
import getRentId from '@salesforce/apex/controllerRent.getRentId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';


export default class LeasePage extends LightningElement {

    @api optRecordId;
    

    @wire(getRentId, {optId: '$optRecordId'}) wiredRecordId;

    recordId;
    @api objectApiName;
    firstRentRecordId;


    get isRecordIdLoaded() {
        return this.wiredRecordId.data && this.wiredRecordId.data.length > 0;
    }
    

    async renderedCallback() {
        console.log(this.optRecordId);
        if (this.isRecordIdLoaded) {
            this.firstRentRecordId = this.wiredRecordId.data[0].Id;
            this.recordId = this.firstRentRecordId;
            console.log(this.recordId);
        }
//         else{
//             await createRentRecord({ opportunityId: this.optRecordId });
// }
    }

strBook;
strDate;
strEndDate;
strDura;



   handleSuccess(e) {
        // Close the modal window and display a success toast
        // this.recordId = this.wiredRecordId.data[0].Id;

    
        console.log(this.optRecordId, this.firstRentRecordId, this.wiredRecordId.data[0].Id);
    
        console.log(this.recordId);
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
   handleStartDate(event)
   {
    this.strDate = event.target.value;
    console.log(this.strDate);
    this.calculateEndDate();
   }
   handleEndDate(event)
   {
    this.strEndDate = event.target.value;
    console.log(this.strEndDate);
   }
   handleDuration(event)
   {
    this.strDura = event.target.value;
    console.log(this.strDura);
    this.calculateEndDate();
   }

   calculateEndDate() {
    if (this.strDate && this.strDura) {
        const startDate = new Date(this.strDate);
        const leaseDuration = parseInt(this.strDura, 10) || 0; // Lease duration in months

        const endDate = new Date(startDate);
        endDate.setFullYear(startDate.getFullYear() + leaseDuration);
        this.strEndDate = endDate.toISOString().substr(0, 10); // Format as YYYY-MM-DD
    } else {
        this.strEndDate = null;
    }
}
handleGoBack()
{
    window.history.go(-1);
}
   
}





   
 

