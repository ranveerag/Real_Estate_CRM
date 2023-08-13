import { LightningElement } from 'lwc';

export default class GetterProperty extends LightningElement {

    firstName='';
    lastName='';
    handleChange(event){
        const field = event.target.name;
        if(field ==='firstName'){
            this.firstName =event.target.value;
        }
        else if(field === 'lastName'){
            this.lastName =event.target.value;
        }
    }
    //console.log(${this.firstName});
    //console.log(${this.lastName});
    get upperCaseName(){
        return (`${this.firstName} ${this.lastName}`.toUpperCase());
    }

}