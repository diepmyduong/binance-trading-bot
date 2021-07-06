import { setContext } from "apollo-link-context";

export function SetAuthToken(token: string) {
  console.log("user token", token);
  localStorage.setItem("user-token", token);
}

export function ClearAuthToken() {
  localStorage.removeItem("user-token");
}

export function GetAuthToken() {
  return localStorage.getItem("user-token") || "";
}

export function ClearCustomerToken() {
  localStorage.removeItem("tokenCustomer");
}

export function GetCustomerToken() {
  return localStorage.getItem("tokenCustomer") || "";
}

export function SetAuthTokenMember(token: string) {
  console.log("member token", token);
  localStorage.setItem("member-token", token);
}

export function ClearAuthTokenMember() {
  localStorage.removeItem("member-token");
}

export function GetAuthTokenMember() {
  return localStorage.getItem("member-token") || "";
}

export function GetIP() {
  return localStorage.getItem("user-ip") || "";
}

export function SetIP(ip: string) {
  return localStorage.setItem("user-ip", ip);
}
export function GetAnonymousToken() {
  return sessionStorage.getItem("anonymous-token") || "";
}

export function SetAnonymousToken(token: string) {
  console.log("set token", token);
  sessionStorage.setItem("anonymous-token", token);
}
export const AuthLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  return new Promise((resolve) => {
    let token = GetAuthToken();
    if (location.pathname.startsWith("/shop")) {
      token = GetAuthTokenMember();
      console.log("shop token", token);
    } else if (location.pathname.startsWith("/admin")) {
      token = GetAuthToken();
      console.log("admin token", token);
    } else {
      token = GetAuthToken() || GetAnonymousToken() || GetCustomerToken();
    }
    const ip = GetIP();
    const context = {
      headers: {
        ...headers,
        ...(token && token !== "undefined"
          ? {
              "x-token": token,
            }
          : {}),
        ...(ip && ip !== "undefined"
          ? {
              "x-forwarded-for": ip,
            }
          : {}),
      },
    };
    // return the headers to the context so httpLink can read them
    resolve(context);
  });
});
