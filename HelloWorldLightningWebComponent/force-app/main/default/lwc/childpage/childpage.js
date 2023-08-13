import { LightningElement, wire, api,track } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from 'lightning/navigation';
import getflatdetails from '@salesforce/apex/controller.getflatdetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';





export default class Childpage extends NavigationMixin(LightningElement) {
    @api Location;
    @api Building;
    @api Block;
    @api Facing;
    @api Floor;
    @api recordId;
    @wire(getflatdetails, {location: '$Location', building: '$Building', block: '$Block', facing: '$Facing', floor: '$Floor'}) wiredProduct2;

    
    @track selectedCheckboxes = [];
    @track showValidationError = false;
    @track showMergeValidationError = false;


    selection1AdjFlat=" ";
    selection2AdjFlat=" ";
    selection1=" ";
    selection2=" ";
    @track isButtonDisabled = true;

    handleCheckboxChange(event) {
        this.isButtonDisabled = true;

        const checkboxValue = event.target.value;
        if (event.target.checked) {
            if (this.selectedCheckboxes.length < 2) {
                this.selectedCheckboxes.push(checkboxValue);
            } else {
                event.target.checked = false; // Uncheck the checkbox
                this.showValidationError = true;
                const toastEvent = new ShowToastEvent({
                    title: 'Error',
                    message: 'You can only select up to two checkboxes.',
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent);
            }
        } else {
            this.selectedCheckboxes = this.selectedCheckboxes.filter(value => value !== checkboxValue);
            this.showValidationError = false;

        }
        if(this.selectedCheckboxes.length === 2){
            this.isButtonDisabled = false;
        this.selection1AdjFlat = (this.wiredProduct2.data.find(record => record.Id === this.selectedCheckboxes[0])).Adjacent_Flat_Number__c;
        this.selection2AdjFlat = (this.wiredProduct2.data.find(record => record.Id === this.selectedCheckboxes[1])).Adjacent_Flat_Number__c;
        this.selection1 = (this.wiredProduct2.data.find(record => record.Id === this.selectedCheckboxes[0])).ProductCode;
        this.selection2 = (this.wiredProduct2.data.find(record => record.Id === this.selectedCheckboxes[1])).ProductCode;

        }
        // else{
        //     this.selection1AdjFlat=" ";
        //     this.selection2AdjFlat=" ";
        //     this.selection1=" ";
        //     this.selection2=" ";
        // }

        console.log(this.selection1AdjFlat,this.selection2AdjFlat);
        
    }

    // handleSubmit() {
    //     if (this.selectedCheckboxes.length !== 2) {
    //         this.showValidationError = true;
    //     } else {
    //         this.showValidationError = false;
    //         // Perform your submission logic here
    //     }
    // }

    handleCancel() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: "/one/one.app#" + encodedDef,
                actionName: 'cancel'
            }
        });
    }

    handleNextPage(e) {
        if(this.selectedCheckboxes.length == 2){
            
            console.log(this.selection1AdjFlat,this.selection1,this.selection2AdjFlat,this.selection2);

            
            if(this.selection1AdjFlat===this.selection2 && this.selection2AdjFlat===this.selection1){
                
            
                console.log("if");
                let cmpDef = {
                componentDef: "c:leasePage",
                };
            
                let encodedDef = btoa(JSON.stringify(cmpDef));
                this[NavigationMixin.Navigate]({
                type: "standard__webPage",
                attributes: {
                    url: "/one/one.app#" + encodedDef
                }
                });
            }
            else
            {
                this.showMergeValidationError =true;
                const toastEvent2 = new ShowToastEvent({
                    title: 'Error',
                    message: 'Selected only adjacent flats',
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent2);
                console.log("validation error");
            }
      }
      else{
        this.showMergeValidationError =false;
      }
    }

    handlenextPage(e) {
        if(this.selectedCheckboxes.length >= 0){
            console.log("sdf", this.recordId);

            let fields = {
                Opportunity_Name__c: this.recordId // Assuming this is the lookup field to Opportunity in Rent__c
            };
        
            let rentRecordInput = { apiName: 'Rent__c', fields };
            
            createRecord(rentRecordInput)
                .then(rentRecord => {
                    console.log('Rent record created:', rentRecord.id);
        
                    let cmpDef = {
                        componentDef: 'c:leasePage',
                        attributes: {
                            optRecordId: this.recordId
                        }
                    };
                    
                    let encodedDef = btoa(JSON.stringify(cmpDef));
                    this[NavigationMixin.Navigate]({
                        type: 'standard__webPage',
                        attributes: {
                            url: '/one/one.app#' + encodedDef
                        }
                    });
                })
                .catch(error => {
                    console.error('Error creating Rent record:', error);
                });
        }
    }

}