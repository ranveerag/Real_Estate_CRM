import { LightningElement, api } from 'lwc';

export default class NavbarChildComponent extends LightningElement {
    @api navList;
    handleNavSelection(event) {
        console.log('1 child....',event);

        event.preventDefault();
        const selectEvent = new CustomEvent('selection', {

            detail: event.target.name
        });

        //this.dispatchEvent(new CustomEvent('close'));
        this.dispatchEvent(selectEvent);
    }
}