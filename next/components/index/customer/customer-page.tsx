import React, { useState } from "react";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { Input } from "../../shared/utilities/form/input";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { CustomerProvider, CustomerContext } from "./provider/customer-prodiver";
import { Spinner } from "../../shared/utilities/spinner";
import { useToast } from "../../../lib/providers/toast-provider";
import BreadCrumbs from "../../shared/utilities/breadcrumbs/breadcrumbs";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { FaAddressCard, FaEdit, FaBlenderPhone, FaUserAlt } from "react-icons/fa";
import { AddressGongDialog } from "./components/address-gong-dialog";
import { Label } from "../../shared/utilities/form/label";

export function CustomerPage() {
  const toast = useToast();
  const [openAddress, setOpenAddress] = useState(false);
  const [addressData, setAddressData] = useState<{
    fullAddress: string;
    lat: number;
    lg: number;
  }>();
  const { shopCode } = useShopContext();
  return (
    <CustomerProvider>
      <CustomerContext.Consumer>
        {({ customer, customerUpdateMe, setCustomer }) => (
          <div className="bg-white shadow  min-h-screen  relative rounded-md w-full">
            <BreadCrumbs
              breadcrumbs={[
                { label: "Trang chủ", href: `/${shopCode}` },
                { label: "Thông tin tài khoản" },
              ]}
              className="pt-4 px-4"
            />
            <div className="w-full flex flex-col items-center justify-center py-14">
              {/* <div className="absolute -top-10 w-full flex justify-center">
                  <Img src={""} avatar className="w-20 h-20" />
                </div> */}
              <div className="">
                <h1 className="text-2xl font-bold text-gray-700 text-center">
                  Thông tin tài khoản
                </h1>
              </div>
              {customer ? (
                <div className="w-full px-4 relative">
                  <div className="flex flex-col w-full mt-4">
                    <Label text="Họ và Tên:" />
                    <Input
                      value={customer.name || ""}
                      onChange={(val) => setCustomer({ ...customer, name: val })}
                      defaultValue="Lê Huỳnh Thảo Nguyên"
                      className=" border-gray-300"
                      prefix={<FaUserAlt />}
                    />
                  </div>
                  <div className="flex flex-col w-full mt-4">
                    <Label text="Số điện thoại:" />
                    <Input
                      value={customer.phone || ""}
                      className=" border-gray-300"
                      type="tel"
                      readonly
                      prefix={<FaBlenderPhone />}
                    />
                  </div>
                  <div
                    className="flex flex-col w-full mt-4"
                    onClick={() => {
                      setOpenAddress(true);
                    }}
                  >
                    <Label text="Địa chỉ:" />
                    <Input
                      readonly
                      value={
                        addressData && addressData.fullAddress !== ""
                          ? addressData.fullAddress
                          : customer.fullAddress
                      }
                      placeholder="Nhập địa chỉ giao đến"
                      prefix={<FaAddressCard />}
                      className=" bg-primary-light"
                    />
                  </div>
                  <div className="flex flex-col w-full mt-4">
                    <Label text="Ghi chú thêm địa chỉ:" />
                    <Input
                      onChange={(val) => setCustomer({ ...customer, addressNote: val })}
                      defaultValue="Địa chỉ chi tiết "
                      className=" border-gray-300"
                      value={customer.addressNote || ""}
                      prefix={<FaEdit />}
                    />
                  </div>
                  <div className=" w-full pt-1 flex items-center flex-row-reverse mt-4">
                    <Button
                      text="Lưu thay đổi"
                      primary
                      className="bg-gradient"
                      onClick={async () =>
                        await customerUpdateMe({
                          phone: customer.phone,
                          addressNote: customer.addressNote,
                          fullAddress: addressData.fullAddress || customer.fullAddress,
                          name: customer.name,
                          latitude: addressData.lat || customer.latitude,
                          longitude: addressData.lg || customer.longitude,
                        })
                      }
                    />
                  </div>
                  <AddressGongDialog
                    slideFromBottom="all"
                    title="Nhập địa chỉ"
                    mobileSizeMode
                    isOpen={openAddress}
                    fullAddress={customer.fullAddress}
                    onClose={() => setOpenAddress(false)}
                    onChange={(data) =>
                      setAddressData({
                        fullAddress: data.fullAddress,
                        lat: data.lat,
                        lg: data.lg,
                      })
                    }
                  />
                </div>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        )}
      </CustomerContext.Consumer>
    </CustomerProvider>
  );
}
