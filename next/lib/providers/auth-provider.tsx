import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ClearAuthToken,
  ClearAuthTokenMember,
  GetAuthToken,
  GetAuthTokenMember,
  SetAuthToken,
  SetAuthTokenMember,
} from "../graphql/auth.link";
import { User, UserService } from "../repo/user.repo";
import { firebase } from "../helpers/firebase";
import { Member, MemberService } from "../repo/member.repo";
import { GraphService } from "../repo/graph.repo";

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
    member: Member;
    checkMember: () => Promise<any>;
    loginMemberByPassword: (username: string, password: string) => Promise<any>;
    logoutMember: () => Promise<any>;
    memberUpdateMe: (data) => Promise<Member>;
    redirectToAdminLogin: Function;
    redirectToAdmin: Function;
    redirectToShopLogin: Function;
    redirectToShop: Function;
    redirectToWebappLogin: Function;
    redirectToWebapp: Function;
  }>
>({});

export const PRE_LOGIN_PATHNAME = "pre-login-pathname";

export function AuthProvider(props) {
  // undefined = chưa authenticated, null = chưa đăng nhập
  const [user, setUser] = useState<User>(undefined);
  const [member, setMember] = useState<Member>(undefined);
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
    try {
      let res = await firebase.auth().sendPasswordResetEmail(email);
      return res;
    } catch (err) {
      let message = "";
      switch (err.code) {
        case "auth/email-already-in-use":
          message = `Email "${email}" đã được sử dụng.`;
        case "auth/invalid-email":
          message = `Email "${email}" không hợp lệ.`;
        case "auth/operation-not-allowed":
          message = `Không thể thực hiện chức năng này.`;
        case "auth/weak-password":
          message = `Mật khẩu yếu.`;
        default:
          message = err.message;
      }
      throw new Error(message);
    }
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

  const checkMember = async () => {
    let memberToken = GetAuthTokenMember();
    if (memberToken) {
      if (member === undefined) {
        try {
          let res = await GraphService.query({
            query: `
              memberGetMe {
                ${MemberService.fullFragment}
              }
            `,
          });
          setMember(res.data.g0);
        } catch (err) {
          ClearAuthTokenMember();
          setMember(null);
          throw err.message;
        }
      } else {
        console.log("has member");
        return member;
      }
    } else {
      ClearAuthTokenMember();
      setMember(null);
    }
  };

  const loginMemberByPassword = async (username: string, password: string) => {
    try {
      let res = await GraphService.mutate({
        mutation: `
          loginMemberByPassword(username: "${username}", password: "${password}") {
            member { ${MemberService.fullFragment} } token
          }
        `,
      });
      SetAuthTokenMember(res.data.g0.token);
      setMember(res.data.g0.member);
    } catch (err) {
      ClearAuthTokenMember();
      setMember(null);
      throw err.message;
    }
  };

  const logoutMember = async () => {
    ClearAuthTokenMember();
    setMember(null);
    await MemberService.clearStore();
  };

  const memberUpdateMe = async (data) => {
    return MemberService.mutate({
      mutation: `
        memberUpdateMe(data: $data) {
          ${MemberService.fullFragment}
        }
      `,
      variablesParams: `($data: UpdateMemberInput!)`,
      options: {
        variables: {
          data,
        },
      },
    })
      .then((res) => {
        setMember({ ...member, ...data });
        return res.data.g0;
      })
      .catch((err) => {
        throw err;
      });
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

  const redirectToShopLogin = () => {
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, location.pathname);
    router.replace("/shop/login");
  };

  const redirectToShop = () => {
    let pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    if (member) {
      if (pathname?.includes("/shop")) router.replace(pathname || "/shop");
      else router.replace("/shop");
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
        loginFirebaseEmail,
        resetPasswordFirebaseEmail,
        logout,
        member,
        checkMember,
        loginMemberByPassword,
        logoutMember,
        memberUpdateMe,
        redirectToAdminLogin,
        redirectToAdmin,
        redirectToShopLogin,
        redirectToShop,
        redirectToWebappLogin,
        redirectToWebapp,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
