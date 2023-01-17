class Api{
    constructor(){
        this.baseUrl = 'https://fakestoreapi.com/'
    }

    async fetchProducts(resource){
        const res = await fetch(this.baseUrl + resource);
        const resArr = await res.json();
        return  resArr;
    }
}

export default new Api();