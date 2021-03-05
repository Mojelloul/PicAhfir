import firebase from 'firebase'
const firebaseApp = firebase.initializeApp({
  ***
})
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export{db,auth,storage};