import getConfig from "next/config";
import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/auth";

const {
  publicRuntimeConfig: { firebaseView },
} = getConfig();
if (firebase.apps.length == 0) {
  firebase.initializeApp(firebaseView);
}

export { firebase };
