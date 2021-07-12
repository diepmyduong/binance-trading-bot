import React, { useState } from "react";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";
import { Input } from "../../shared/utilities/form/input";
import { Img } from "../../shared/utilities/img";
import { AddressGroup } from "../../shared/utilities/form/address-group";

export function CustomerPage() {
  const [address, setAddress] = useState(null);
  return (
    <div className="flex items-center justify-center w-full py-20">
      <div className="bg-white shadow relative rounded-md">
        <div className="w-full flex flex-col items-center justify-center py-14">
          <div className="absolute -top-10 w-full flex justify-center">
            <Img src={""} avatar className="w-20 h-20" />
          </div>
          <div className="">
            <h1 className="text-2xl font-bold text-gray-700 text-center">Nguyễn Nhật Ninh</h1>
          </div>
          <Form
            className="w-full px-4"
            onSubmit={async (data) => {
              console.log(data);
            }}
          >
            <div className="w-full pt-8 grid grid-cols-2 gap-x-4">
              <Field label="Họ và Tên" name="name">
                <Input defaultValue="Lê Huỳnh Thảo Nguyên" className=" border-gray-300" />
              </Field>
              <Field label="Số điện thoại" name="phone">
                <Input defaultValue="032 77 33 883" className=" border-gray-300" type="number" />
              </Field>
            </div>
            <Field name="customerAddress">
              <AddressGroup />
            </Field>
            <div className=" w-full">
              <SaveButtonGroup />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
