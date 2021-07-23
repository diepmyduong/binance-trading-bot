import getConfig from "next/config";
import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/auth";

const { publicRuntimeConfig } = getConfig();
if (firebase.apps.length == 0) {
  firebase.initializeApp(JSON.parse(publicRuntimeConfig.firebaseView));
}

export { firebase };
