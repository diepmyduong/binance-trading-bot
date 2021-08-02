import { createContext, useContext, useEffect, useState } from "react";
import { FaBullseye } from "react-icons/fa";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopConfig, ShopConfigService } from "../../../lib/repo/shop-config.repo";
import { ShopRegistrationService } from "../../../lib/repo/shop-registration.repo";

export const AdminLayoutContext = createContext<
  Partial<{ pendingRegistrations: number; checkPendingRegistrations: () => any }>
>({});
export function AdminLayoutProvider(props) {
  const [pendingRegistrations, setPendingRegistrations] = useState(0);

  useEffect(() => {
    checkPendingRegistrations();
  }, []);

  const checkPendingRegistrations = () => {
    ShopRegistrationService.getAll({
      query: { limit: 0, filter: { status: "PENDING" } },
      fragment: "id",
      cache: false,
    }).then((res) => {
      setPendingRegistrations(res.total);
    });
  };

  return (
    <AdminLayoutContext.Provider value={{ pendingRegistrations, checkPendingRegistrations }}>
      {props.children}
    </AdminLayoutContext.Provider>
  );
}

export const useAdminLayoutContext = () => useContext(AdminLayoutContext);
