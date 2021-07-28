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
  const [awaitOtp, setAwaitOtp] = useState(false);
  const { shop, customerLoginOTP, customerLogin } = useShopContext();
  let [sec, setSec] = useState(60);
  const toast = useToast();
  let interval = null;
  async function handleOnSubmit(phone?, otp?) {
    if (shop.config.smsOtp) {
      console.log("phone", phone, "otp", otp);
      if (!otp) {
        if (phone) {
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
        } else {
          toast.warn("Vui lòng nhập số điện thoại");
        }
      } else {
        let res = await customerLoginOTP(phone, otp);
        if (res) {
          toast.success("Đăng nhập thành công");
          clearInterval(interval);
          props.onClose();
        } else {
          toast.error("Đã xảy ra lỗi");
        }
      }
    } else {
      if (phone) {
        let res = await customerLogin(phone);
        if (res) {
          toast.success("Đăng nhập thành công");
          clearInterval(interval);
          props.onClose();
        } else {
          toast.error("Đã xảy ra lỗi");
        }
      } else {
        toast.warn("Vui lòng nhập số điện thoại");
      }
    }
  }
  return (
    <Form
      dialog
      width="400px"
      isOpen={props.isOpen}
      onClose={() => {
        clearInterval(interval);
        props.onClose();
      }}
      slideFromBottom="none"
      className="main-container mb-4"
      onSubmit={(data) => handleOnSubmit(data.phone, data.otp)}
    >
      <div className="flex flex-col items-center w-full pt-4">
        <h3 className="text-28 font-semibold text-accent mb-2 sm:mb-4">Đăng nhập</h3>
        {shop.config.smsOtp ? (
          <LoginOTP awaitOtp={awaitOtp} sec={sec} setSec={setSec} setAwaitOtp={setAwaitOtp} />
        ) : (
          <LogiNoneOTP />
        )}
      </div>
    </Form>
  );
}
function LogiNoneOTP() {
  return (
    <>
      <Field label="Số điện thoại" name="phone" className="mt-4 w-full">
        <Input
          type="tel"
          className="h-12"
          autoFocus
          // onChange={(val) => setphone(val)}
        ></Input>
      </Field>
      <Button
        text="Đăng nhập"
        className="w-full bg-gradient"
        asyncLoading
        primary
        submit
        // onClick={async () => {
        //   let res = await customerLogin(phone);
        //   if (res) {
        //     props.onClose();
        //   } else {
        //     toast.warn("Đã xảy ra lỗi");
        //   }
        // }}
      />
    </>
  );
}
function LoginOTP(props) {
  // const [awaitOtp, setAwaitOtp] = useState(false);
  // const { shop, customerLoginOTP } = useShopContext();
  // const [otp, setOtp] = useState("");
  // let [sec, setSec] = useState(60);
  // const [phone, setphone] = useState("");
  // const toast = useToast();
  // let interval = null;
  // async function handleOTPClick() {
  //   CustomerService.requestOtp(phone)
  //     .then((res) => {
  //       toast.success(res);
  //       setAwaitOtp(true);
  //       interval = setInterval(() => {
  //         if (sec < 1) {
  //           clearInterval(interval);
  //         } else {
  //           sec--;
  //           setSec(sec);
  //         }
  //       }, 1000);
  //     })
  //     .catch((err) => toast.error("Đã xảy ra lỗi"));
  // }
  return (
    <>
      {!props.awaitOtp ? (
        <>
          <Field label="Số điện thoại" name="phone" className="mt-4 w-full">
            <Input
              type="tel"
              className="h-12"
              autoFocus
              //  onChange={(val) => setphone(val)}
            ></Input>
          </Field>
          <Button
            text="Nhận OTP"
            className="w-full bg-gradient"
            primary
            asyncLoading
            submit
            // onClick={async () => {
            //   await handleOTPClick();
            // }}
          />
        </>
      ) : (
        <>
          <p>
            Thời gian còn lại <span className="font-semibold text-primary">{props.sec || 0}</span>{" "}
            giây
          </p>
          <Field label="Mã OTP của bạn" name="otp" className="mt-4 w-full">
            <Input
              type="number"
              autoFocus
              className="h-12"
              // onChange={(val) => setOtp(val)}
            ></Input>
          </Field>
          {props.sec > 0 ? (
            <Button
              text="Đăng nhập"
              className="w-full bg-gradient"
              asyncLoading
              // onClick={async () => {
              //   let res = await customerLoginOTP(phone, otp);
              //   if (res) {
              //     clearInterval(interval);
              //     props.onClose();
              //   } else {
              //     toast.warn("Đã xảy ra lỗi");
              //   }
              // }}
              submit
              primary
            />
          ) : (
            <Button
              text="Thay đổi số điện thoại"
              className="w-full bg-gradient"
              onClick={() => {
                props.setSec(60);
                props.setAwaitOtp(false);
              }}
              primary
            />
          )}
        </>
      )}
    </>
  );
}
