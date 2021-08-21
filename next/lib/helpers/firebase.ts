import getConfig from "next/config";
// import { initializeApp, getApps, FirebaseApp } from "firebase/app";
// // import "firebase/messaging";
// import {
//   Auth,
//   initializeAuth,
//   NextOrObserver,
//   onAuthStateChanged,
//   sendPasswordResetEmail,
//   signInWithEmailAndPassword,
//   signOut,
//   User,
// } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// let auth: Auth;
// let app: FirebaseApp;

const {
  publicRuntimeConfig: { firebaseView },
} = getConfig();
if (firebase.apps.length == 0) {
  firebase.initializeApp(firebaseView);
}

// class LazyFirebase {
//   private static _instance: LazyFirebase;
//   static get instance() {
//     if (!this._instance) {
//       this._instance = new LazyFirebase();
//     }
//     return this._instance;
//   }
//   private _app: FirebaseApp;
//   private _auth: Auth;
//   constructor() {
//     const {
//       publicRuntimeConfig: { firebaseView },
//     } = getConfig();
//     this._app = getApps()[0];
//     if (!this._app) {
//       this._app = initializeApp(firebaseView);
//       this._auth = initializeAuth(this._app);
//     }
//   }
//   get app() {
//     return this._app;
//   }
//   get auth() {
//     return this._auth;
//   }
//   sendPasswordResetEmail(email: string) {
//     return sendPasswordResetEmail(this._auth, email);
//   }
//   onAuthStateChanged(fn: NextOrObserver<User>) {
//     console.log("call onAuthStateChanged");
//     return onAuthStateChanged(this._auth, fn);
//   }
//   signInWithEmailAndPassword(email: string, password: string) {
//     return signInWithEmailAndPassword(this._auth, email, password);
//   }
//   signOut() {
//     return signOut(this._auth);
//   }
// }

export { firebase };
