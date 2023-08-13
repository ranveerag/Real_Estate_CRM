import { LightningElement, api } from 'lwc';

export default class AdjacentFlat extends LightningElement {
    @api Location;
    @api Building;
    @api Block;
    @api Facing;
    @api Floor;

    fetchData() {
        // Fetch data based on the provided properties (Location, Building, etc.)
        // Display the fetched data within the component
    }
}