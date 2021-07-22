import React, { useState } from "react";
import { Form } from "../utilities/form/form";
import { Field } from "../utilities/form/field";
import { Input } from "../utilities/form/input";
import { DialogPropsType } from "../utilities/dialog/dialog";
import { Button } from "../utilities/form/button";
interface Propstype extends DialogPropsType {
  onConfirm: Function;
  otp?: boolean;
}

export function CustomerLoginDialog({ otp = false, ...props }: Propstype) {
  const [awaitOtp, setAwaitOtp] = useState(false);
  return (
    <Form
      dialog
      width="400px"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={(data) => props.onConfirm(data.phoneUser)}
      slideFromBottom="none"
      className="main-container mb-4"
    >
      <div className="flex flex-col items-center w-full pt-4">
        <h3 className="text-32 font-bold text-accent">Đăng nhập</h3>
        <Field label="Số điện thoại" name="phoneUser" className="mt-4 w-full">
          <Input type="tel"></Input>
        </Field>
        {!otp || (otp && awaitOtp) ? (
          <Button text="Đăng nhập" className="w-full bg-gradient" submit primary />
        ) : (
          <Button text="Nhận OTP" className="w-full bg-gradient" primary />
        )}
      </div>
    </Form>
  );
}
