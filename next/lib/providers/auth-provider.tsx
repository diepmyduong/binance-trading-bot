import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

import { ClearAuthToken, GetAuthToken, SetAuthToken } from "../graphql/auth.link";
import { firebase } from "../helpers/firebase";
import { User, UserService } from "../repo/user.repo";
import jwtDecoder from "jwt-decode";

export const AuthContext = createContext<
  Partial<{
    user: User;
    resetPasswordFirebaseEmail: (email: string) => Promise<any>;
    loginFirebaseEmail: (email: string, password: string) => Promise<any>;
    logout: () => Promise<any>;
    updateUser: (data: User) => Promise<any>;
    updateUserPassword: (id: string, password: string) => Promise<any>;
    activeUser: (userId: string) => Promise<User>;
    blockUser: (userId: string) => Promise<User>;
    redirectToAdminLogin: Function;
    redirectToAdmin: Function;
  }>
>({});

export const PRE_LOGIN_PATHNAME = "pre-login-pathname";

export function AuthProvider(props) {
  // undefined = chưa authenticated, null = chưa đăng nhập
  const [user, setUser] = useState<User>(undefined);
  const router = useRouter();
  //authentication with firebase
  const getFirebaseErrorMsg = (err) => {
    switch (err.code) {
      case "auth/email-already-in-use":
        return `Email đã được sử dụng.`;
      case "auth/invalid-email":
        return `Email không hợp lệ.`;
      case "auth/operation-not-allowed":
        return `Không thể thực hiện chức năng này.`;
      case "auth/weak-password":
        return `Mật khẩu yếu.`;
      case "auth/user-not-found":
        return `Không tìm thấy người dùng`;
      case "auth/wrong-password":
        return "Sai mật khẩu";
      default:
        return err.message;
    }
  };
  useEffect(() => {
    const userToken = GetAuthToken();
    if (userToken) {
      const decodedToken = jwtDecoder<any>(userToken);
      if (decodedToken.exp && new Date().getTime() > decodedToken.exp * 1000) {
        waitForFirebase();
      } else {
        console.log("try current token login");
        UserService.userGetMe()
          .then((res) => setUser(res))
          .catch((err) => {
            ClearAuthToken();
            waitForFirebase();
          });
      }
    } else {
      waitForFirebase();
    }
  }, []);

  const updateUser = async (data: User) => {
    return await UserService.update({ id: user.id, data: data });
  };

  const resetPasswordFirebaseEmail = async (email: string) => {
    try {
      let res = await firebase.auth().sendPasswordResetEmail(email);
      return res;
    } catch (err) {
      throw new Error(getFirebaseErrorMsg(err));
    }
  };

  const loginFirebaseEmail = async (email: string, password: string) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const { user, token } = await UserService.login(await userCredential.user.getIdToken());
      SetAuthToken(token);
      setUser(user);
    } catch (err) {
      console.error(err);
      ClearAuthToken();
      setUser(null);
      throw new Error(getFirebaseErrorMsg(err));
    }
  };

  const logout = async () => {
    await firebase.auth().signOut();
    await UserService.clearStore();
  };

  const activeUser = async (userId) => {
    return UserService.activeUser(userId);
  };

  const blockUser = async (userId) => {
    return UserService.blockUser(userId);
  };

  const updateUserPassword = (id: string, password: string) => {
    return UserService.updateUserPassword(id, password);
  };

  const redirectToAdminLogin = () => {
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, location.pathname);
    router.replace("/admin/login");
  };

  const redirectToAdmin = () => {
    let pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    if (user) {
      if (pathname?.includes("/admin")) router.replace(pathname || "/admin");
      else router.replace("/admin");
    } else {
      router.replace("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        activeUser,
        blockUser,
        updateUserPassword,
        loginFirebaseEmail,
        resetPasswordFirebaseEmail,
        logout,
        redirectToAdminLogin,
        redirectToAdmin,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );

  function waitForFirebase() {
    console.log("wait for firebase login");
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        UserService.login(await user.getIdToken())
          .then((res) => {
            const { user, token } = res;
            SetAuthToken(token);
            setUser(user);
          })
          .catch((err) => {
            ClearAuthToken();
            setUser(null);
          });
      } else {
        ClearAuthToken();
        setUser(null);
      }
    });
  }
}

export const useAuth = () => useContext(AuthContext);
