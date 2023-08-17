import { LightningElement, api, track, wire } from 'lwc';
import getRentId from '@salesforce/apex/controllerRent.getRentId';
//import getLeaseDeatils from '@salesforce/apex/controllerRent.getLeaseDeatils';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';


export default class LeasePage extends LightningElement {

    initail;
    percent;
    answer;
    year;
    index;
    

    @api optRecordId;
    @api duration;
    @api InitialPrice;
    @api PercentageIncrease;
    

    @wire(getRentId, {optId: '$optRecordId'}) wiredRecordId;
   // @wire(getLeaseDeatils, {duration: '$duration', InitialPrice: '$InitialPrice', PercentageIncrease: '$PercentageIncrease' }) wiredRecordId;
 
    recordId;
    @api objectApiName;
    firstRentRecordId;

    get isRecordIdLoaded() {
        return this.wiredRecordId.data && this.wiredRecordId.data.length > 0;
    }
    
    renderedCallback() {
        console.log(this.optRecordId);
        if (this.isRecordIdLoaded) {
            this.firstRentRecordId = this.wiredRecordId.data[0].Id;
            this.recordId = this.firstRentRecordId;
            console.log(this.recordId);
        }
    }

@track  strBook;
@track strDate = new Date();
@track strEndDate;
@track strDura;
startYear = 0;

handleInitailValue(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    const rowIndex = event.target.closest("tr").getAttribute("data-key");

    this.staticRows[rowIndex][fieldName] = fieldValue;
}
get staticRows() {
    let rows = [];

    for (let i = 0; i < this.strDura; i++) {
        const isDisabled = i === 0;
        rows.push({ 
            key: i, 
            year: this.startYear + i + "-" + (this.startYear%100 + i+1) , 
            disabled: isDisabled
        });

    }
    return rows;
}




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

    this.startYear = new Date(this.strDate).getFullYear();
    console.log(this.startYear);
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
    this.strDura = Number(event.target.value);
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
        console.log("getter ",this.Index);

    } else {
        this.strEndDate = null;
    }
}
handleGoBack()
{
    window.history.go(-1);
}
handleInitailValue(event){
    
    this.initail = Number(event.target.value);
    //console.log(event?.currentTarget?.dataset.idx);
    this.percent = Number(event.target.value);
    //this.calculateSubValue();
    this.Index= Number(event?.currentTarget?.dataset.idx);
    const InitValue =Number(this.template.querySelectorAll('.Initvalue')[this.Index].value);
    const PercentValue = Number(this.template.querySelectorAll('.Percentvalue')[this.Index].value);
    this.template.querySelectorAll('.answerC')[this.Index].value =((InitValue * PercentValue) /100) +InitValue;
    //console.log(this.row.initail);
    console.log("getter ",this.Index);

}






}