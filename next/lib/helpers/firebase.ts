import firebase from "firebase/app";
import "firebase/auth";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
if (firebase.apps.length == 0) {
  firebase.initializeApp(JSON.parse(publicRuntimeConfig.firebaseView));
}

export { firebase };
