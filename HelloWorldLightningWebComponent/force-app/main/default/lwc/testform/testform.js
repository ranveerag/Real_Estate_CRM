import { LightningElement, api, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from "lightning/navigation";
import  fetchOptDetails from '@salesforce/apex/controller.fetchOptDetails';

 
export default class TestForm extends NavigationMixin(LightningElement) {
   @api recordId;
   @api objectApiName;

strLoc;
strBuild;
strBlock;
strFacing;
strFloor;


get isRecordIdAvailable() {
    return !!this.recordId;
}

renderedCallback() {
    if (this.isRecordIdAvailable) {
        console.log(this.recordId);
        // Perform the rest of your logic here
    }
}

@wire(fetchOptDetails, {optId: '$recordId'}) rentList({error, data}) {
    if (data) {
        //console.log("data wired",data);

            this.strLoc = data[0].Locations__c;
            this.strBuild = data[0].Buildings__c;
            this.strBlock = data[0].Block__c;
            this.strFloor = data[0].Floors__c;
            this.strFacing = data[0].Facings__c;

        }
     else if(error) {
        console.log("errror");
    }
}

   navigateNextPage() {
    console.log(this.strLoc,this.strBuild,this.strBlock ,this.strFacing,this.strFloor, this.recordId);
    let cmpDef = {
      componentDef: "c:childpage",
        attributes: {
        Location: this.strLoc,
        Building: this.strBuild,
        Block: this.strBlock,
        Facing: this.strFacing,
        Floor: this.strFloor,
        recordId: this.recordId
    }
    };

    let encodedDef = btoa(JSON.stringify(cmpDef));
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: "/one/one.app#" + encodedDef
      }
    });
  }

   handleSuccess(e) {
        // Close the modal window and display a success toast
        this.dispatchEvent(new CloseActionScreenEvent());
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Opportunity Record Updated!',
                variant: 'success'
            })
        );
   }
   handleLocChange(event)
   {
    this.strLoc = event.target.value;
    console.log(this.strLoc);
    //console.log("recrdId3",this.recordId,this.strBlock,this.strBuild,this.strFloor);
   }

   handleBuildingChange(event)
   {
    this.strBuild = event.target.value;
    console.log(this.strBuild);
   }

   handleBlockChange(event)
   {
    this.strBlock = event.target.value;
    console.log(this.strBlock);
   }

   handleFacingChange(event)
   {
    this.strFacing = event.target.value;
    console.log(this.strFacing);
   }

   handleFloorChange(event)
   {
    this.strFloor = event.target.value;
    console.log(this.strFloor);
   }
}