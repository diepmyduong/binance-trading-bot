---
to: next<% if(name=='unnamed'){%>/<%} else {%>/<%= name %>/<%}%>providers/<%= h.inflection.dasherize(n) %>-provider.tsx
---
import { createContext, useContext } from "react";
type <%= h.inflection.camelize(n) %>ContextProps = {
  [x: string]: any;
}
export const <%= h.inflection.camelize(n) %>Context = createContext<<%= h.inflection.camelize(n) %>ContextProps>({});

export function <%= h.inflection.camelize(n) %>Provider(props) {
  return <<%= h.inflection.camelize(n) %>Context.Provider value={{}}>{props.children}</<%= h.inflection.camelize(n) %>Context.Provider>;
}

export const use<%= h.inflection.camelize(n) %>Context = () => useContext(<%= h.inflection.camelize(n) %>Context);