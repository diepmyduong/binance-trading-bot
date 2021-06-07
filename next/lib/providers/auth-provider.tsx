import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { ClearAuthToken, GetAuthToken, SetAuthToken } from "../graphql/auth.link";
import { User, UserService } from "../repo/user.repo";
import { firebase } from "../helpers/firebase";

export const AuthContext = createContext<
  Partial<{
    user: User;
    throwErrorName?: (any) => string;
    resetPasswordFirebaseEmail: (email: string) => Promise<any>;
    loginFirebaseEmail: (email: string, password: string) => Promise<any>;
    logout: () => Promise<any>;
    loginMember: (username: string, password: string) => Promise<any>;
    logoutMember: () => Promise<any>;
    updateUser: (data: User) => Promise<any>;
    updateUserPassword: (id: string, password: string) => Promise<any>;
    activeUser: (userId: string) => Promise<User>;
    blockUser: (userId: string) => Promise<User>;
    redirectToAdminLogin: Function;
    redirectToAdmin: Function;
    redirectToWebappLogin: Function;
    redirectToWebapp: Function;
  }>
>({});

export const PRE_LOGIN_PATHNAME = "pre-login-pathname";

export function AuthProvider(props) {
  // undefined = chưa authenticated, null = chưa đăng nhập
  const [user, setUser] = useState<User>(undefined);
  const router = useRouter();
  //authentication with firebase
  const throwErrorName = (err) => {
    switch (err.code) {
      case "auth/email-already-in-use":
        return `Email address ${this.state.email} already in use.`;
        break;
      case "auth/invalid-email":
        return `Email address ${this.state.email} is invalid.`;
        break;
      case "auth/operation-not-allowed":
        return `Error during sign up.`;
        break;
      case "auth/weak-password":
        return "Password is not strong enough. Add additional characters including special characters and numbers.";
        break;
      default:
        return err.message;
        break;
    }
  };
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        UserService.loginUserByToken(await user.getIdToken())
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
  }, []);

  const updateUser = async (data: User) => {
    return await UserService.update({ id: user.id, data: data });
  };

  const resetPasswordFirebaseEmail = async (email: string) => {
    return await firebase.auth().sendPasswordResetEmail(email);
  };

  const loginFirebaseEmail = async (email: string, password: string) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const { user, token } = await UserService.loginUserByToken(
        await userCredential.user.getIdToken()
      );
      SetAuthToken(token);
      setUser(user);
    } catch (err) {
      ClearAuthToken();
      setUser(null);
      console.log("asdasd", err);
      let message = "";
      switch (err.code) {
        case "auth/user-not-found": {
          message = "Không tìm thấy người dùng";
          break;
        }
        case "auth/invalid-email": {
          message = "Email không hợp lệ";
          break;
        }
        case "auth/wrong-password": {
          message = "Sai mật khẩu";
          break;
        }
        default: {
          message = "Có lỗi xảy ra";
          break;
        }
      }
      throw new Error(message);
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

  const redirectToWebappLogin = () => {
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, location.pathname);
    router.replace("/login");
  };

  const redirectToWebapp = () => {
    let pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    if (pathname?.includes("/admin")) {
      router.replace("/");
    } else router.replace(pathname || "/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        activeUser,
        blockUser,
        updateUserPassword,
        throwErrorName,
        loginFirebaseEmail,
        resetPasswordFirebaseEmail,
        logout,
        redirectToAdminLogin,
        redirectToAdmin,
        redirectToWebappLogin,
        redirectToWebapp,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
