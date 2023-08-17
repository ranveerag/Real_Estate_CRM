import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from "lightning/navigation";
 
export default class TestForm extends NavigationMixin(LightningElement) {
   @api recordId;
   @api objectApiName;
 
strLoc;
strBuild;
strBlock;
strFacing;
strFloor;

   navigateNextPage() {
    console.log(this.strLoc);
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