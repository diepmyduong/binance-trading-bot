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
      className="main-container mb-4"
    >
      <Field label="Số điện thoại" name="phoneUser">
        <Input type="tel"></Input>
      </Field>
      <Button text="Xác nhận" submit primary />
    </Form>
  );
};

export default CustomerLoginDialog;
