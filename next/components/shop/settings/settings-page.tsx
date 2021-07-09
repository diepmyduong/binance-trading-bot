import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ShopPageTabs } from "../../shared/shop-layout/shop-page-tabs";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { AccountSettings } from "./components/account-settings";
import { ConfigSettings } from "./components/config-settings";
import { DeliverySettings } from "./components/delivery-settings";
import { GeneralSettings } from "./components/general-settings";
import { PaymentSettings } from "./components/payment-settings";

export function SettingsPage(props: ReactProps) {
  const router = useRouter();
  const [type, setType] = useState("");

  useEffect(() => {
    if (SETTINGS_TABS.find((x) => x.value == router.query.type)) {
      setType(router.query.type as string);
    } else {
      setType(SETTINGS_TABS[0].value);
    }
  }, [router.query]);

  return (
    <>
      <div className="pb-6 border-b border-gray-300">
        <ShopPageTitle title="Cấu hình" subtitle="Thay đổi cấu hình của cửa hàng" />
      </div>
      <ShopPageTabs
        options={SETTINGS_TABS}
        value={type}
        onChange={(val) => {
          router.replace(`/shop/settings/${val}`);
        }}
      />
      <div className="mt-3">
        {
          {
            general: <GeneralSettings />,
            config: <ConfigSettings />,
            account: <AccountSettings />,
            delivery: <DeliverySettings />,
            payment: <PaymentSettings />,
          }[type]
        }
      </div>
    </>
  );
}

export const SETTINGS_TABS: Option[] = [
  { value: "general", label: "Thông tin cơ bản" },
  { value: "config", label: "Thiết lập cửa hàng" },
  { value: "account", label: "Tài khoản" },
  { value: "delivery", label: "Giao hàng" },
  { value: "payment", label: "Thanh toán" },
];
