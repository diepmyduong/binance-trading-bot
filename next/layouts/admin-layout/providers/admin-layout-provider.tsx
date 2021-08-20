import { createContext, useContext, useEffect, useState } from "react";

export const AdminLayoutContext = createContext<
  Partial<{ pendingRegistrations: number; checkPendingRegistrations: () => any }>
>({});
export function AdminLayoutProvider(props) {
  return <AdminLayoutContext.Provider value={{}}>{props.children}</AdminLayoutContext.Provider>;
}

export const useAdminLayoutContext = () => useContext(AdminLayoutContext);
