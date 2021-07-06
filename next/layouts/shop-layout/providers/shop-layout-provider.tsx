import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopConfig, ShopConfigService } from "../../../lib/repo/shop-config.repo";

export const ShopLayoutContext = createContext<
  Partial<{ shopConfig: ShopConfig; updateShopConfig: (data) => Promise<ShopConfig> }>
>({});
export function ShopLayoutProvider(props) {
  const [shopConfig, setShopConfig] = useState<ShopConfig>(null);
  const { member } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (member) {
      ShopConfigService.getShopConfig()
        .then((res) => {
          setShopConfig(res);
        })
        .catch((err) => {
          toast.error("Có lỗi xảy ra. " + err.message);
        });
    } else {
      setShopConfig(null);
    }
  }, [member]);

  const updateShopConfig = async (data) => {
    return ShopConfigService.update({
      id: shopConfig.id,
      data,
      toast,
    }).then((res) => {
      setShopConfig(res);
      return res;
    });
  };

  return (
    <ShopLayoutContext.Provider value={{ shopConfig, updateShopConfig }}>
      {props.children}
    </ShopLayoutContext.Provider>
  );
}

export const useShopLayoutContext = () => useContext(ShopLayoutContext);
