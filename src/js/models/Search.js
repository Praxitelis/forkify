import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getResults() {

        
        const key = '3a5042b3b9d67b8564c99c6533f220be';
        try {
        const res = await axios(`https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result = res.data.recipes;
        //console.log(this.result);
        } catch(error) {
        alert(error);
        }
    }

}








