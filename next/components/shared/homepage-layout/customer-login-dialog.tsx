import React from "react";
import { Form } from "../utilities/form/form";
import { Field } from "../utilities/form/field";
import { Input } from "../utilities/form/input";
import { DialogPropsType } from "../utilities/dialog/dialog";
import { Button } from "../utilities/form/button";
interface Propstype extends DialogPropsType {
  onConfirm: Function;
}

export function CustomerLoginDialog(props: Propstype) {
  return (
    <Form
      title="Đăng nhập"
      dialog
      width="320px"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={(data) => props.onConfirm(data.phoneUser)}
      slideFromBottom="none"
      className="main-container mb-4"
    >
      <Field label="Số điện thoại" name="phoneUser" className="mt-3">
        <Input type="tel" autoFocus></Input>
      </Field>
      <Button text="Đăng nhập" className="w-full" submit primary />
    </Form>
  );
}
