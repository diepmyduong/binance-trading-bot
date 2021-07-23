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

export function ClearCustomerToken(shopCode: string) {
  localStorage.removeItem(shopCode + "customer-token");
}

export function GetCustomerToken(shopCode: string) {
  return localStorage.getItem(shopCode + "customer-token") || "";
}
export function SetCustomerToken(token: string, shopCode: string) {
  console.log("customer token", token);
  localStorage.setItem(shopCode + "customer-token", token);
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
export function GetAnonymousToken(shopCode: string) {
  return sessionStorage.getItem(shopCode + "anonymous-token") || "";
}
export function ClearAnonymousToken(shopCode: string) {
  localStorage.removeItem(shopCode + "anonymous-token");
}
export function SetAnonymousToken(token: string, shopCode: string) {
  console.log("set token", token);
  sessionStorage.setItem(shopCode + "anonymous-token", token);
}
export const AuthLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  return new Promise((resolve) => {
    let token = GetAuthToken();
    if (location.pathname.startsWith("/shop")) {
      token = GetAuthTokenMember();
      // console.log("shop token", token);
    } else if (location.pathname.startsWith("/admin")) {
      token = GetAuthToken();
      // console.log("admin token", token);
    } else {
      const shopCode = sessionStorage.getItem("shopCode");
      const customerToken = GetCustomerToken(shopCode);
      const anonymousToken = GetAnonymousToken(shopCode);
      // if (customerToken) {
      //   console.log("customer token", customerToken);
      // } else {
      //   console.log("anonymous token", anonymousToken);
      // }
      token = customerToken || anonymousToken;
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
