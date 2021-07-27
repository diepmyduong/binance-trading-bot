import React, { useState } from "react";
import { Form } from "../utilities/form/form";
import { Field } from "../utilities/form/field";
import { Input } from "../utilities/form/input";
import { DialogPropsType } from "../utilities/dialog/dialog";
import { Button } from "../utilities/form/button";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { CustomerService } from "../../../lib/repo/customer.repo";
import { useToast } from "../../../lib/providers/toast-provider";
interface Propstype extends DialogPropsType {}

export function CustomerLoginDialog({ ...props }: Propstype) {
  const { shop } = useShopContext();
  return (
    <Form
      dialog
      width="400px"
      isOpen={props.isOpen}
      onClose={props.onClose}
      slideFromBottom="none"
      className="main-container mb-4"
    >
      <div className="flex flex-col items-center w-full pt-4">
        <h3 className="text-32 font-bold text-accent mb-4">Đăng nhập</h3>
        {shop.config.smsOtp ? (
          <LoginOTP onClose={props.onClose} />
        ) : (
          <LogiNoneOTP onClose={props.onClose} />
        )}
      </div>
    </Form>
  );
}
function LogiNoneOTP(props) {
  const [phone, setphone] = useState("");
  const { shop, customerLogin } = useShopContext();
  const toast = useToast();
  return (
    <div className="flex flex-col items-center w-full pt-4">
      <Field label="Số điện thoại" name="phoneUser" className="mt-4 w-full">
        <Input type="tel" autoFocus onChange={(val) => setphone(val)}></Input>
      </Field>
      <Button
        text="Đăng nhập"
        className="w-full bg-gradient"
        asyncLoading
        primary
        onClick={async () => {
          let res = await customerLogin(phone);
          if (res) {
            props.onClose();
          } else {
            toast.warn("Đã xảy ra lỗi");
          }
        }}
      />
    </div>
  );
}
function LoginOTP(props) {
  const [awaitOtp, setAwaitOtp] = useState(false);
  const { shop, customerLoginOTP } = useShopContext();
  const [otp, setOtp] = useState("");
  let [sec, setSec] = useState(60);
  const [phone, setphone] = useState("");
  const toast = useToast();
  let interval = null;
  async function handleOTPClick() {
    CustomerService.requestOtp(phone)
      .then((res) => {
        toast.success(res);
        setAwaitOtp(true);
        interval = setInterval(() => {
          if (sec < 1) {
            clearInterval(interval);
          } else {
            sec--;
            setSec(sec);
          }
        }, 1000);
      })
      .catch((err) => toast.error("Đã xảy ra lỗi"));
  }
  return (
    <>
      {!awaitOtp ? (
        <>
          <Field label="Số điện thoại" name="phoneUser" className="mt-4 w-full">
            <Input type="tel" autoFocus onChange={(val) => setphone(val)}></Input>
          </Field>
          <Button
            text="Nhận OTP"
            className="w-full bg-gradient"
            primary
            asyncLoading
            onClick={async () => {
              await handleOTPClick();
            }}
          />
        </>
      ) : (
        <>
          <p>
            Thời gian còn lại <span className="font-semibold text-primary">{sec}</span> giây
          </p>
          <Field label="Mã OTP của bạn" name="phoneUser" className="mt-4 w-full">
            <Input type="tel" autoFocus onChange={(val) => setOtp(val)}></Input>
          </Field>
          {/* {sec > 0 ? ( */}
          <Button
            text="Đăng nhập"
            className="w-full bg-gradient"
            asyncLoading
            onClick={async () => {
              let res = await customerLoginOTP(phone, otp);
              if (res) {
                clearInterval(interval);
                props.onClose();
              } else {
                toast.warn("Đã xảy ra lỗi");
              }
            }}
            primary
          />
          {/* ) : ( */}
          {/* <Button
            text="Thay đổi số điện thoại"
            className="w-full bg-gradient"
            onClick={() => {
              setSec(60);
              setAwaitOtp(false);
            }}
            primary
          /> */}
          {/* )} */}
        </>
      )}
    </>
  );
}
