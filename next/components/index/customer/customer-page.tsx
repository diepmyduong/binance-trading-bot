import React, { useState } from "react";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { Input } from "../../shared/utilities/form/input";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { CustomerConsumer, CustomerProvider } from "./provider/customer-prodiver";
import { Spinner } from "../../shared/utilities/spinner";
import { useToast } from "../../../lib/providers/toast-provider";
import BreadCrumbs from "../../shared/utilities/breadcrumbs/breadcrumbs";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { FaAddressCard } from "react-icons/fa";
import { AddressGongDialog } from "./components/address-gong-dialog";

export function CustomerPage() {
  const toast = useToast();
  const [openAddress, setOpenAddress] = useState(false);
  const { shopCode } = useShopContext();
  return (
    <CustomerProvider>
      <CustomerConsumer>
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
                <Form
                  initialData={{
                    name: customer.name,
                    phone: customer.phone,
                  }}
                  className="w-full px-4 relative"
                  onSubmit={async (data) => {
                    customerUpdateMe({
                      ...data,
                      longitude: customer.longitude,
                      latitude: customer.latitude,
                      fulla,
                    })
                      .then((res) => {
                        toast.success("Cập nhật thông tin thành công");
                      })
                      .catch((err) => {
                        toast.error("Cập nhật thông tin thất bại");
                      });
                  }}
                >
                  <Field label="Họ và Tên" name="name">
                    <Input defaultValue="Lê Huỳnh Thảo Nguyên" className=" border-gray-300" />
                  </Field>

                  <Field label="Số điện thoại" name="phone">
                    <Input
                      defaultValue="032 77 33 883"
                      className=" border-gray-300"
                      type="tel"
                      readonly
                    />
                  </Field>
                  <div
                    onClick={() => {
                      setOpenAddress(true);
                    }}
                  >
                    <Field label="Địa chỉ">
                      <Input
                        readonly
                        value={customer.fullAddress}
                        type="text"
                        placeholder="Nhập địa chỉ giao đến"
                        prefix={<FaAddressCard />}
                        className=" bg-primary-light"
                      />
                    </Field>
                  </div>
                  <div className=" w-full sticky bottom-4">
                    <SaveButtonGroup bgGadient />
                  </div>
                </Form>
              ) : (
                <Spinner />
              )}
            </div>
            <AddressGongDialog
              slideFromBottom="all"
              title="Nhập địa chỉ"
              mobileSizeMode
              isOpen={openAddress}
              fullAddress={customer.fullAddress}
              onClose={() => setOpenAddress(false)}
              onChange={(data) =>
                setCustomer({
                  ...customer,
                  fullAddress: data.fullAddress,
                  latitude: data.lat,
                  longitude: data.lg,
                })
              }
            />
          </div>
        )}
      </CustomerConsumer>
    </CustomerProvider>
  );
}
