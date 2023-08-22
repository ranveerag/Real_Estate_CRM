import { LightningElement, api, track, wire } from 'lwc';
//import getRentId from '@salesforce/apex/controllerRent.getRentId';
import getRentList from '@salesforce/apex/controllerRent.getRentList';
//import insertTableData from '@salesforce/apex/storeData.insertTableData';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
//import { loadStyle } from 'lightning/platformResourceLoader';
import updateTableData from '@salesforce/apex/storeData.updateTableData';


export default class LeasePage extends LightningElement {


    @track initValueArr = [];
    @track percentValueArr = [];
    @track answerValueArr = [];
    @track yearArr =[];
    isRecordIdLoaded=true;

    initail;
    percent;
    answer;
    year;
    Index;
    

    @api optRecordId;
    @api duration;
    @api InitialPrice;
    @api PercentageIncrease;
    

   @wire(getRentList, {optId: '$optRecordId'}) rentList({error, data}) {
    if (data) {
        console.log("data wired",data);
        for (let i = 0; i < data.length; i++) {
            console.log("inside loop");

            this.initValueArr.push(data[i].Initial_Price__c);
            this.percentValueArr.push(data[i].percent_increase__c);
            this.answerValueArr.push(data[i].Sub_Value__c);
            this.yearArr.push(data[i].Year__c);
        }
    } else if(error) {
        console.log("errror");
    }}


 
    recordId;
    @api objectApiName;
    firstRentRecordId;


@track  strBook;
@track _staticRows= [];
@track strDate;
@track strEndDate;
@api strDura;
startYear = 0;





get staticRows() {
    let rows = [];
    if(!isNaN(this.strDura)){
    for (let i = 0; i < this.strDura; i++) {
        const isDisabled = i === 0;
        let yearValue;
        if (this.yearArr.length > 0) {
            yearValue = this.yearArr[i];
        } else {
            yearValue = this.startYear + i + "-" + (this.startYear % 100 + i + 1);
        }
        rows.push({ 
            key: i, 
            External: 'RN-' + (this.startYear + i + 1),
            year: yearValue, 
            Initail: this.initValueArr[i],
            Percent: this.percentValueArr[i],
            Answer: this.answerValueArr[i],
            disabled: isDisabled
            
        });

    }
    return rows;
}
}


saveDataToSalesforce() {
    console.log('staticRows:', JSON.stringify(this.staticRows));
    updateTableData({ rowsData: this.staticRows ,optId: this.optRecordId})
        .then(result => {
            // Handle success
            console.log(result);
        })
        .catch(error => {
            // Handle error
            console.log('Error inserting records:', error);
        });
}




   handleSuccess(e) {
        // Close the modal window and display a success toast
        // this.recordId = this.wiredRecordId.data[0].Id;

    
        //console.log(this.optRecordId, this.firstRentRecordId, this.wiredRecordId.data[0].Id);
    
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
    //console.log(this.rentList.data[0],this.rentList.data, this._staticRows);
    //console.log(this._staticRows,this._staticRows,this.initValueArr[0]);
    this.calculateEndDate();
   }
   handleEndDate(event)
   {
    this.strEndDate = event.target.value;
    console.log(this.strEndDate);
   }
   handleDuration(event)
   {

    this.initValueArr = [];
    this.percentValueArr = [];
    this.answerValueArr = [];
    this.yearArr =[];
    this.strDura = event.target.value;
    console.log(this.strDura);
    
    this.calculateEndDate();
   }

   calculateEndDate() {
    if (this.strDate && this.strDura && !isNaN(this.strDura)) {
        const startDate = new Date(this.strDate);
        const leaseDuration = parseInt(this.strDura, 10) || 0; // Lease duration in months

        const endDate = new Date(startDate);
        endDate.setFullYear(startDate.getFullYear() + leaseDuration);
        this.strEndDate = endDate.toISOString().substr(0, 10); // Format as YYYY-MM-DD
        //console.log("getter ",this.Index);

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
    this.initValueArr[this.Index] = InitValue;
    this.percentValueArr[this.Index] = PercentValue;
    //console.log(this.row.initail);
    //console.log("getter ",this.Index,InitValue);
    console.log("getter ",this.initValueArr[0],this.initValueArr[1],this.percentValueArr[1],this.percentValueArr[2]);

}






}