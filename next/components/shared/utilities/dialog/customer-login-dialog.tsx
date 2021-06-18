import React from "react";
import { Form } from "../form/form";
import { Field } from "../form/field";
import { Input } from "../form/input";
import { DialogPropsType } from "./dialog";
import { Button } from "../form/button";
interface Propstype extends DialogPropsType {
  onConfirm: Function;
}

const CustomerLoginDialog = (props: Propstype) => {
  return (
    <Form
      title="Đăng nhập"
      dialog
      width="320px"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={(data) => props.onConfirm(data.phoneUser)}
      mobileMode={false}
      className="main-container mb-4"
    >
      <Field label="Số điện thoại" name="phoneUser" className="mt-3">
        <Input type="tel"></Input>
      </Field>
      <Button text="Đăng nhập" className="w-full" submit primary />
    </Form>
  );
};

export default CustomerLoginDialog;
