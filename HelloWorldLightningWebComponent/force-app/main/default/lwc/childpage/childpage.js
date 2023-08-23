import { LightningElement, wire, api,track } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from 'lightning/navigation';
import getflatdetails from '@salesforce/apex/controller.getflatdetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import getRentId from '@salesforce/apex/controllerRent.getRentId';
//import createRentRecord from '@salesforce/apex/controllerRent.createRentRecord';
import createOpportunityLineItem from '@salesforce/apex/controllerRent.createOpportunityLineItem';
import getDurationOfLease from '@salesforce/apex/controllerRent.getDurationOfLease';







export default class Childpage extends NavigationMixin(LightningElement) {


    @api Location;
    @api Building;
    @api Block;
    @api Facing;
    @api Floor;
    @api recordId;
    @wire(getflatdetails, {location: '$Location', building: '$Building', block: '$Block', facing: '$Facing', floor: '$Floor'}) wiredProduct2;
    //@wire(getRentId, { optId: '$recordId' }) wiredRecordId;

    @track selectedCheckboxes = [];
    @track leaseDuration;



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
                const toastEvent = new ShowToastEvent({
                    title: 'Error',
                    message: 'You can only select up to two checkboxes.',
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent);
            }
        } else {
            this.selectedCheckboxes = this.selectedCheckboxes.filter(value => value !== checkboxValue);

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
    @wire(getDurationOfLease, { optId: '$recordId' })
    wiredLeaseDuration({ error, data }) {
        if (data) {
            this.leaseDuration = data;
        } else if (error) {
            // Handle error if needed
            console.error(error);
        }
    }
    

    async handleNextPage(e) {
        if(this.selectedCheckboxes.length == 2){
            
            //console.log(this.selection1AdjFlat,this.selection1,this.selection2AdjFlat,this.selection2);
            
            if(this.selection1AdjFlat===this.selection2 && this.selection2AdjFlat===this.selection1){
                // console.log("if");
                let cmpDef = {
                    componentDef: 'c:leasePage',
                    attributes: {
                        optRecordId: this.recordId,
                        strDura: this.leaseDuration
                    }
                };
                let encodedDef = btoa(JSON.stringify(cmpDef));
                this[NavigationMixin.Navigate]({
                type: "standard__webPage",
                attributes: {
                    url: "/one/one.app#" + encodedDef
                }
                });
                    await createOpportunityLineItem({
                        opportunityId: this.recordId,
                        quantity: 1,
                        productId: this.selectedCheckboxes[0],
                        mergeFlag: true // Pass the correct product ID here
                    });
                    await createOpportunityLineItem({
                        opportunityId: this.recordId,
                        quantity: 1,
                        productId: this.selectedCheckboxes[1],
                        mergeFlag: true // Pass the correct product ID here
                    });
            }
            else
            {
                const toastEvent2 = new ShowToastEvent({
                    title: 'Error',
                    message: 'Selected only adjacent flats',
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent2);
                console.log("validation error");
            }
      }
    //   else{
    //     this.showMergeValidationError =false;
    //   }
    }

    async handlenextPage(e) {
        if(this.selectedCheckboxes.length == 1){
            // if (this.wiredRecordId.data && this.wiredRecordId.data.length > 0) {
            //     const existingRentRecordId = this.wiredRecordId.data[0].Id;
                 console.log('Existing Rent Record Id:', this.leaseDuration);
                let cmpDef = {
                    componentDef: 'c:leasePage',
                    attributes: {
                        optRecordId: this.recordId,
                        strDura: this.leaseDuration
                    }
                };
                let encodedDef = btoa(JSON.stringify(cmpDef));
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {
                        url: '/one/one.app#' + encodedDef
                    }
                });
            // } else {
            //     // Create a new record in Rent__c object
            //     try {
            //         await createRentRecord({ opportunityId: this.recordId });
            //         // Proceed with navigation
            //         let cmpDef = {
            //             componentDef: 'c:leasePage',
            //             attributes: {
            //                 optRecordId: this.recordId
            //             }
            //         };
            //         let encodedDef = btoa(JSON.stringify(cmpDef));
            //         this[NavigationMixin.Navigate]({
            //             type: 'standard__webPage',
            //             attributes: {
            //                 url: '/one/one.app#' + encodedDef
            //             }
            //         });
            //     } catch (error) {
            //         console.error('Error creating Rent record:', error);
            //     }
            // }
            // //await createOpportunityLineItem({ opportunityId: this.recordId, quantity: 1 });
            // //const newRentId = await createRentRecord({ opportunityId: this.recordId });
                    await createOpportunityLineItem({
                        opportunityId: this.recordId,
                        quantity: 1,
                        productId: this.selectedCheckboxes[0],
                        mergeFlag: false // Pass the correct product ID here
                    });

        }
        else if(this.selectedCheckboxes.length < 1)
            {
                const toastEvent3 = new ShowToastEvent({
                    title: 'Error',
                    message: 'Select atleast one Flat to continue',
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent3);
                console.log("validation error");
            }
            else
            {
                const toastEvent4 = new ShowToastEvent({
                    title: 'Error',
                    message: 'Select only one Flat at a time',
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent4);
                console.log("validation error");
            }

    }
        handlePreButton(){
            window.history.go(-1);
        }
}