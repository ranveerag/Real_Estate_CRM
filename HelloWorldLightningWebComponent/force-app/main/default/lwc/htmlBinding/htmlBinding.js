import { LightningElement } from 'lwc';

export default class HtmlBinding extends LightningElement {
    name = "Ranveer";
    handleChange(event){
        this.name = event.target.value;
    }
}