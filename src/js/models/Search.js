import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getResults() {

        
        const key = 'e41e6cd21e2defcbf100e5c4d4020caf';
        try {
        const res = await axios(`https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result = res.data.recipes;
        // console.log(this.result);
        } catch(error) {
        alert(error);
        }
    }

}








