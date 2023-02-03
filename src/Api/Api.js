import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

class Api{
    constructor(){
        this.baseUrl = 'https://dummyjson.com/'
    }

    async fetchProducts(resource){
        const res = await fetch(this.baseUrl + resource);
        const resArr = await res.json();
        return  resArr;
    }

    async registerUser(user){
        const auth = getAuth();
        let userAuth = {}
        createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
            userAuth = userCredential
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
        return userAuth;
    }

    async signOut(){
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('Signed out')
        }).catch((error) => {
        // An error happened.
        });

    }
}

export default new Api();