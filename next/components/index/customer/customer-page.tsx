import React, { useState } from "react";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { Input } from "../../shared/utilities/form/input";
import { Img } from "../../shared/utilities/img";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { CustomerConsumer, CustomerProvider } from "./provider/customer-prodiver";
import { Spinner } from "../../shared/utilities/spinner";
import { useToast } from "../../../lib/providers/toast-provider";

export function CustomerPage() {
  const toast = useToast();
  return (
    <CustomerProvider>
      <CustomerConsumer>
        {({ customer, customerUpdateMe }) => (
          <div className="flex items-center justify-center w-full py-20">
            <div className="bg-white shadow relative rounded-md w-full">
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
                      wardId: customer.wardId,
                      districtId: customer.districtId,
                      provinceId: customer.provinceId,
                      address: customer.address,
                      name: customer.name,
                      phone: customer.phone,
                    }}
                    className="w-full px-4"
                    onSubmit={async (data) => {
                      customerUpdateMe(data)
                        .then((res) => {
                          toast.success("Cập nhật thông tin thành công");
                        })
                        .catch((err) => {
                          toast.error("Cập nhật thông tin thất bại");
                        });
                    }}
                  >
                    <div className="w-full pt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <Field label="Họ và Tên" name="name">
                        <Input defaultValue="Lê Huỳnh Thảo Nguyên" className=" border-gray-300" />
                      </Field>
                      <Field label="Số điện thoại" name="phone">
                        <Input
                          defaultValue="032 77 33 883"
                          className=" border-gray-300"
                          type="tel"
                        />
                      </Field>
                    </div>
                    <AddressGroup
                      {...{
                        wardId: customer.wardId,
                        districtId: customer.districtId,
                        provinceId: customer.provinceId,
                        address: customer.address,
                      }}
                    />
                    <div className=" w-full">
                      <SaveButtonGroup />
                    </div>
                  </Form>
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        )}
      </CustomerConsumer>
    </CustomerProvider>
  );
}
